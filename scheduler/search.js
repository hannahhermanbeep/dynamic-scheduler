/**
 * search.js
 * Bounded backtracking solver for dynamic schedule adjustments
 */

window.search = (function() {

    const MAX_SHIFT = 15; // maximum adjustment in minutes
    const STEP = 5;       // 5-minute increments

    /**
     * Generate candidate durations for a flexible activity
     * @param {Object} activity
     * @returns {Array} candidate durations
     */
    function generateDurationCandidates(activity) {
        const candidates = [];
        const min = Math.max(activity.minDuration, activity.duration - MAX_SHIFT);
        const max = Math.min(activity.maxDuration, activity.duration + MAX_SHIFT);
        for (let d = min; d <= max; d += STEP) {
            candidates.push(d);
        }
        return candidates;
    }

    /**
     * Generate candidate start times for an activity
     * @param {Object} activity
     * @param {Number} dayStart
     * @param {Number} dayEnd
     * @returns {Array} candidate start times
     */
    function generateStartCandidates(activity, dayStart, dayEnd) {
        const min = Math.max(dayStart, activity.start - MAX_SHIFT);
        const max = Math.min(dayEnd - activity.duration, activity.start + MAX_SHIFT);
        const candidates = [];
        for (let t = min; t <= max; t += STEP) {
            candidates.push(t);
        }
        return candidates;
    }

    /**
     * Recursive backtracking search
     * @param {Array} schedule - array of activities
     * @param {Number} index - current activity index
     * @param {Number} dayStart
     * @param {Number} dayEnd
     * @param {Array} solutions - accumulates candidate solutions
     */
    function backtrack(schedule, index, dayStart, dayEnd, solutions) {
        if (index >= schedule.length) {
            // End of schedule reached; store deep copy
            solutions.push(utils.deepCopy(schedule));
            return;
        }

        const activity = schedule[index];

        // Skip locked activities
        if (activity.locked) {
            backtrack(schedule, index + 1, dayStart, dayEnd, solutions);
            return;
        }

        const durationCandidates = activity.flexible ? generateDurationCandidates(activity) : [activity.duration];
        const startCandidates = generateStartCandidates(activity, dayStart, dayEnd);

        for (let dur of durationCandidates) {
            activity.duration = dur;
            for (let start of startCandidates) {
                activity.start = start;

                // Propagate changes forward and backward
                window.propagation.propagateAll(schedule, dayStart, dayEnd);

                // Validate schedule so far
                const validation = window.constraints.validateSchedule(schedule, dayStart, dayEnd);
                if (validation.valid) {
                    // Recurse to next activity
                    backtrack(schedule, index + 1, dayStart, dayEnd, solutions);
                }
                // else skip invalid combination
            }
        }

        // Restore original activity state after loop
        activity.start = schedule[index].start;
        activity.duration = schedule[index].duration;
    }

    /**
     * Generate candidate solutions for a schedule
     * @param {Array} schedule
     * @param {Number} dayStart
     * @param {Number} dayEnd
     * @returns {Array} candidate schedules
     */
    function generateCandidates(schedule, dayStart, dayEnd) {
        const solutions = [];
        const copy = utils.deepCopy(schedule);
        backtrack(copy, 0, dayStart, dayEnd, solutions);
        return solutions;
    }

    return {
        generateCandidates
    };

})();
