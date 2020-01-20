const Shift = require("./../../models/Shift");
const helpers = require("../../helpers");
const User = require("./../../models/User");
const db = helpers.db;
async function getAdmins() {
  let admins = await User.find({ employee_type: 1 }, "_id");
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
        return Promise.resolve(updatedShift);
      } catch (error) {
        return Promise.reject("Error when updating shift, please try again");
      }
    }
  },

  getShift: async req => {
    try {
      let shifts = await Shift.find({});
      return Promise.resolve(shifts);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  createShift: async req => {
    try {
      let params = req.body;
      const user = req.user;
      let { repeatDays, startDate, endDate, notes } = params;

      let assignedTo = params.assigned_to ? params.assigned_to : user._id;
      let employeeType = user.employee_type;
      let shiftType = !params.shift_type ? employeeType : params.shift_type;
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
        is_approved: isApprvoed,
        assigned_to: assignedTo,
        startDate: startDate,
        endDate: endDate,
        shift_type: shiftType,
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

function createNotificationForAdmins() {}
