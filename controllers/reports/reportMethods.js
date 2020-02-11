const Shift = require("../../models/Shift");
const User = require("../../models/User");
const moment = require("moment");
const now = moment();

module.exports = {
  filteredReports: async req => {
    // Get shifts based on filters
    try {
      let { assignedTo, startDate, endDate, isApproved } = req.params;

      startDate = startDate
        ? moment(startDate).toISOString()
        : now.toISOString();

      endDate = endDate ? moment(endDate).toISOString() : now.toISOString();

      assignedTo = assignedTo ? assignedTo : req.user._id;

      isApproved = isApproved ? isApproved : { admin: 1, employee: 1 };

      let users = await User.find();

      let graphData = {
        data: {
          labels: [],
          datasets: [
            {
              label: "",
              data: []
            }
          ]
        }
      };

      users.map(async (user, index) => {
        let userShifts = await Shift.find({ assignedTo: { $in: [user._id] } });
        let totalHours = 0;
        console.log(userShifts);

        if (userShifts.length > 0) {
          userShifts.map(({ startDate, endDate }) => {
            totalHours += moment(startDate).diff(endDate, "hours");
          });

          graphData.data.labels.push(user.name);

          graphData.data.datasets.push({
            label: userShifts[index].startDate,
            data: totalHours
          });
        }
      });

      //   let response = {
      //     data: {
      //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      //     datasets: [{
      //         label: '# of Votes',
      //         data: [12, 19, 3, 5, 2, 3],
      //         backgroundColor: [
      //             'rgba(255, 99, 132, 0.2)',
      //             'rgba(54, 162, 235, 0.2)',
      //             'rgba(255, 206, 86, 0.2)',
      //             'rgba(75, 192, 192, 0.2)',
      //             'rgba(153, 102, 255, 0.2)',
      //             'rgba(255, 159, 64, 0.2)'
      //         ],
      //         borderColor: [
      //             'rgba(255, 99, 132, 1)',
      //             'rgba(54, 162, 235, 1)',
      //             'rgba(255, 206, 86, 1)',
      //             'rgba(75, 192, 192, 1)',
      //             'rgba(153, 102, 255, 1)',
      //             'rgba(255, 159, 64, 1)'
      //         ],
      //         borderWidth: 1
      //     }]
      //   }
      // }

      return Promise.resolve(graphData);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  weekly: async req => {
    let dates = {
      startOfWeek: now.startOf("week").toISOString(),
      endOfWeek: now.endOf("week").toISOString()
    };

    let shifts = await Shift.find({ startDate: { $gt: dates.startOfWeek } });
    let users = await User.find({ groupID: { $gt: 1 } });

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
