/**
 * realtime.js
 * Handles real-time locks and past activity enforcement
 */

window.realtime = (function() {

    /**
     * Determine which activities are locked due to time already passed
     * @param {Array} activities - array of activity objects with start/duration
     * @param {Number} currentTime - current time in minutes since midnight
     * @returns {Array} array of booleans, true if activity is locked
     */
    function getTimeLocks(activities, currentTime) {
        return activities.map(activity => {
            const end = activity.start + activity.duration;
            return end <= currentTime;
        });
    }

    /**
     * Apply time locks to activities
     * Sets a `locked` property on activities which have ended
     * @param {Array} activities
     * @param {Number} currentTime
     */
    function applyTimeLocks(activities, currentTime) {
        activities.forEach(activity => {
            const end = activity.start + activity.duration;
            if (end <= currentTime) {
                activity.locked = true; // permanently locked
            }
        });
    }

    /**
     * Check if a specific activity is locked due to time
     * @param {Object} activity
     * @param {Number} currentTime
     * @returns {Boolean}
     */
    function isLockedByTime(activity, currentTime) {
        return (activity.start + activity.duration) <= currentTime;
    }

    /**
     * Filter activities to only include those that can still be changed
     * @param {Array} activities
     * @param {Number} currentTime
     * @returns {Array} mutable activities
     */
    function getMutableActivities(activities, currentTime) {
        return activities.filter(act => !isLockedByTime(act, currentTime) && !act.locked);
    }

    /**
     * Update the current schedule with real-time locks
     */
    function enforceRealTimeLocks() {
        const currentTime = window.state.getCurrentTimeMinutes();
        const schedule = window.state.getCurrentSchedule();
        applyTimeLocks(schedule, currentTime);
        window.state.setCurrentSchedule(schedule); // update state with locks
    }

    // Expose functions globally
    return {
        getTimeLocks,
        applyTimeLocks,
        isLockedByTime,
        getMutableActivities,
        enforceRealTimeLocks
    };

})();
