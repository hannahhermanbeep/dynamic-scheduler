/**
 * constraints.js
 * Conflict detection and validation for the dynamic classroom scheduler
 */

window.constraints = (function() {

    /**
     * Check if an activity is within its min/max duration
     * @param {Object} activity
     * @returns {Boolean} true if valid
     */
    function durationValid(activity) {
        return activity.duration >= activity.minDuration && activity.duration <= activity.maxDuration;
    }

    /**
     * Check if activity is within day boundaries
     * @param {Object} activity
     * @param {Number} dayStart - minutes
     * @param {Number} dayEnd - minutes
     * @returns {Boolean}
     */
    function withinDayBoundaries(activity, dayStart, dayEnd) {
        return activity.start >= dayStart && (activity.start + activity.duration) <= dayEnd;
    }

    /**
     * Check for overlaps in the schedule
     * @param {Array} activities
     * @returns {Array} array of objects {a, b} for conflicting activities
     */
    function findOverlaps(activities) {
        const conflicts = [];
        for (let i = 0; i < activities.length; i++) {
            const a = activities[i];
            for (let j = i + 1; j < activities.length; j++) {
                const b = activities[j];
                if (utils.rangesOverlap(a.start, a.start + a.duration, b.start, b.start + b.duration)) {
                    conflicts.push({ a, b });
                }
            }
        }
        return conflicts;
    }

    /**
     * Validate the entire schedule
     * @param {Array} activities
     * @param {Number} dayStart
     * @param {Number} dayEnd
     * @returns {Object} { valid: Boolean, errors: Array }
     */
    function validateSchedule(activities, dayStart, dayEnd) {
        const errors = [];

        activities.forEach(act => {
            if (!durationValid(act)) {
                errors.push({ type: 'duration', activity: act });
            }
            if (!withinDayBoundaries(act, dayStart, dayEnd)) {
                errors.push({ type: 'dayBoundary', activity: act });
            }
            if (act.locked) {
                errors.push({ type: 'locked', activity: act });
            }
        });

        const overlaps = findOverlaps(activities);
        overlaps.forEach(conflict => {
            errors.push({ type: 'overlap', a: conflict.a, b: conflict.b });
        });

        return { valid: errors.length === 0, errors };
    }

    /**
     * Check if schedule order is consistent (activities sorted by start)
     * @param {Array} activities
     * @returns {Boolean}
     */
    function isOrderValid(activities) {
        for (let i = 1; i < activities.length; i++) {
            if (activities[i].start < activities[i - 1].start) return false;
        }
        return true;
    }

    /**
     * Attempt to fix simple overlaps by shifting subsequent activities minimally
     * Does not modify locked activities
     * @param {Array} activities
     * @param {Number} dayEnd
     */
    function propagateOverlaps(activities, dayEnd) {
        for (let i = 0; i < activities.length - 1; i++) {
            const a = activities[i];
            const b = activities[i + 1];
            const aEnd = a.start + a.duration;
            if (aEnd > b.start && !b.locked) {
                const shift = aEnd - b.start;
                b.start += shift;
                if ((b.start + b.duration) > dayEnd) {
                    b.duration = Math.max(0, dayEnd - b.start);
                }
            }
        }
    }

    // Expose functions globally
    return {
        durationValid,
        withinDayBoundaries,
        findOverlaps,
        validateSchedule,
        isOrderValid,
        propagateOverlaps
    };

})();
