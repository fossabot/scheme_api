const Shift = require("./../../models/Shift");
const helpers = require("../../helpers");
const User = require("./../../models/User");
const moment = require("moment");
const db = helpers.db;
const cache = helpers.cache;
async function getAdmins() {
  let admins = await User.find({ groupID: 1 }, "_id");
  return admins;
}
module.exports = {
  /**
   * Create shifts from a new timesheet and then save the timesheet
   */
  createFromTimesheet: async req => {
    try {
      const { timesheet } = req.body;
      await Shift.insertMany(timesheet);
      return Promise.resolve("Timesheet successfully added to schedule");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  deleteShift: async req => {
    try {
      const { id } = req.body;
      await Shift.findByIdAndDelete({ _id: id });
      return Promise.resolve("Shift successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateShift: async req => {
    const { update, id } = req.body;

    // Check if admin & create notification for admins to approve
    if (!req.isAdmin) {
      let msg = `${req.user.name} is requesting changes to their shift`;
      let sameShiftNotifications = await db.findDuplicateNotification({
        content: { id },
        requested_by: req.user._id
      });
      if (sameShiftNotifications && sameShiftNotifications.length >= 2) {
        return Promise.reject(
          "You have made the maximum shift change requests for this shift."
        );
      }

      await db.createNotification({
        title: "",
        message: msg,
        for: await getAdmins(),
        requestData: { id, update },
        content: update,
        type: "approve",
        url: "/shifts/update",
        requested_by: req.user._id
      });
    } else {
      try {
        const updatedShift = await Shift.findByIdAndUpdate({ _id: id }, update);
        return Promise.resolve("Shift successfully updated.");
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },

  getShift: async req => {
    try {
      let shifts, payload;
      let now = moment().toISOString();

      if (!cache.get("shifts")) {
        shifts = await Shift.find();

        payload = {
          upcoming: [],
          previous: [],
          today: [],
          all: []
        };

        for (let i = 0, len = shifts.length; i < len; i++) {
          const shift = shifts[i].toObject();
          let { startDate, endDate } = shift;

          startDate = moment(startDate);
          endDate = moment(endDate);

          payload.all.push(shift);

          if (endDate.isBefore(now)) {
            shift.timeTag = "previous";
            payload.previous.push(shift);
          }

          if (startDate.isAfter(now)) {
            payload.upcoming.push(shift);
            shift.timeTag = "upcoming";
          }

          if (startDate.isSame(new Date(), "day")) {
            shift.timeTag = "today";

            payload.today.push(shift);
          }
        }
        cache.set("shifts", payload);
      } else {
        payload = cache.get("shifts");
      }
      return Promise.resolve(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  createShift: async req => {
    try {
      let params = req.body;
      const user = req.user;
      let { repeatDays, startDate, endDate, notes } = params;

      let assignedTo = params.assignedTo ? params.assignedTo : user._id;
      let groupID = user.groupID;
      let type = !params.type ? groupID : params.type;
      let isApprvoed = {};

      if (req.isAdmin) {
        isApprvoed = {
          admin: 1,
          user: 1
        };
      }
      if (!startDate || !endDate) {
        return Promise.reject("Please enter a date or time");
      }

      let mongoShift = {
        isApproved: isApprvoed,
        assignedTo: assignedTo,
        startDate: startDate,
        endDate: endDate,
        type: type,
        notes
      };
      if (repeatDays) {
        mongoShift["repeat_days"] = repeatDays;
      }

      // Check that the shift doesn't already exist with the datetime
      const duplicateShift = await Shift.findOne({
        startDate: startDate,
        key: assignedTo,
        endDate: endDate
      });

      if (!duplicateShift) {
        let shift = new Shift(mongoShift);
        // Send request to admins if they are an admin

        if (req.isAdmin) {
          const savedShift = await shift.save();
          return Promise.resolve(savedShift);
        } else {
          // Create notification
          let admins = await getAdmins();
          let msg = `${req.user.name} has made a request`;

          await db.createNotification({
            message: msg,
            for: admins,
            content: mongoShift,
            type: "approve",
            requestBody: {
              url: "/shifts/create",
              method: "POST",
              data: mongoShift
            },
            requested_by: req.user._id
          });

          return Promise.resolve(
            "Request successfully sent to admins for approval"
          );
        }
      } else {
        return Promise.reject("Shift already exists");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
