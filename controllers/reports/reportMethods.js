const Shift = require("../../models/Shift");
const User = require("../../models/User");
const moment = require("moment");
const now = moment();

module.exports = {
  weekly: async req => {
    let dates = {
      startOfWeek: now.startOf("week").toISOString(),
      endOfWeek: now.endOf("week").toISOString()
    };

    let shifts = await Shift.find({ startDate: { $gt: dates.startOfWeek } });
    console.log(shifts);
    let users = await User.find({ employeeType: { $gt: 1 } });

    let weeklyTotalsDisplay = {
      mostHours: {
        label: "Worked this most hours this week",
        result: "No team members"
      },
      averageHours: {
        label: "Average Hours",
        result: 0
      },
      shiftsCount: {
        label: "Shifts worked this week",
        result: 0
      }
    };
    try {
      let userTotals = [];
      let averageHoursSum = 0;

      for (let i = 0, len = users.length; i < len; i++) {
        let user = users[i];
        let { _id, name } = user;

        for (let j = 0, _len = shifts.length; j < _len; j++) {
          let { startDate, endDate, assignedTo, type, status } = shifts[j];

          if (
            moment(startDate).isSame(new Date(), "week") &&
            status == "complete"
          ) {
            if (type == 1) {
              weeklyTotalsDisplay.shiftsCount.result++;
            }

            let _startDate = moment(startDate);
            let _endDate = moment(endDate);

            assignedTo = assignedTo.length > 1 ? assignedTo : assignedTo[0];

            let shiftDurationInHours = _endDate.diff(_startDate, "hours");

            averageHoursSum += shiftDurationInHours;

            if (!Array.isArray(assignedTo)) {
              if (assignedTo == _id) {
                userTotals.push({
                  name,
                  duration: shiftDurationInHours
                });
              }
            }
            weeklyTotalsDisplay.mostHours.result = userTotals.sort((a, b) => {
              return b.duration - a.duration;
            })[0];
          }
        }
        averageHoursSum = Math.round(averageHoursSum / shifts.length);
        weeklyTotalsDisplay.averageHours.result = averageHoursSum;
      }
      return Promise.resolve(weeklyTotalsDisplay);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  shifts: async req => {
    try {
      // Who worked the most shifts
      let shifts = await Shift.find();
      let users = await User.find();
      let data = {
        labels: [
          "General Shift",
          "Locumn",
          "Holiday",
          "Time Off",
          "Sick leave"
        ],
        datasets: []
      };

      for (let i = 0, len = users.length; i < len; i++) {
        let user = users[i];
        let { _id, name } = user;
        let userTotal = {
          label: name,
          data: []
        };

        for (let j = 0, _len = shifts.length; j < _len; j++) {
          let shift = shifts[j];
          let { assignedTo, startDate, endDate, type } = shift;

          let _startDate = moment(startDate);
          let _endDate = moment(endDate);

          let shiftDurationInHours = _endDate.diff(_startDate, "hours");

          if (Array.isArray(assignedTo)) {
            let dataSetData = [];

            assignedTo.map(assignee => {
              if (assignee == _id) {
                let _type = type - 1;
                userTotal.data.push(shiftDurationInHours);
              }
            });
          }
        }
        data.datasets.push(userTotal);
      }

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }

    // Create new array that contains the shifts that they worked by the user
  },
  metrics: async req => {
    try {
      // Only display shifts that are completed
      let shifts = await Shift.find({ status: "incomplete" });
      let teamMembers = await User.find();

      let metricsShifts = shifts.map(shift => {
        let { startDate, endDate } = shift;
        startDate = moment(startDate);
        endDate = moment(endDate);

        let shiftTimeSpan = () => {
          function runDiff(timeUnit) {
            return endDate.diff(startDate, timeUnit);
          }
          return {
            display: {
              title: ""
            },
            hours: runDiff("hours")
          };
        };
        return {
          totalHours: shiftTimeSpan()
        };
      });

      return Promise.resolve(metricsShifts);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
