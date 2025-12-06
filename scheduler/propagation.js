/**
 * propagation.js
 * Forward and backward propagation of activity times in the dynamic scheduler
 */

window.propagation = (function() {

    /**
     * Forward propagate start times and adjust durations minimally
     * @param {Array} activities - sorted by start time
     * @param {Number} dayEnd - day end in minutes
     */
    function forwardPropagate(activities, dayEnd) {
        for (let i = 0; i < activities.length - 1; i++) {
            const current = activities[i];
            const next = activities[i + 1];

            // Ensure activities do not overlap
            let overlap = (current.start + current.duration) - next.start;
            if (overlap > 0) {
                if (!next.locked && next.flexible) {
                    // Reduce next duration if possible
                    let reduction = Math.min(next.duration - next.minDuration, overlap);
                    next.duration -= reduction;
                    overlap -= reduction;
                }

                if (overlap > 0 && !next.locked) {
                    // Shift next activity forward
                    next.start += overlap;
                }
            }
        }

        // Ensure last activity ends at or before dayEnd
        const last = activities[activities.length - 1];
        if ((last.start + last.duration) > dayEnd && last.flexible && !last.locked) {
            last.duration = Math.max(last.minDuration, dayEnd - last.start);
        }
    }

    /**
     * Backward propagate start times and adjust durations minimally
     * Useful when an activity is moved earlier
     * @param {Array} activities - sorted by start time
     * @param {Number} dayStart - day start in minutes
     */
    function backwardPropagate(activities, dayStart) {
        for (let i = activities.length - 1; i > 0; i--) {
            const current = activities[i];
            const prev = activities[i - 1];

            // Ensure activities do not overlap
            let overlap = prev.start + prev.duration - current.start;
            if (overlap > 0) {
                if (!prev.locked && prev.flexible) {
                    let reduction = Math.min(prev.duration - prev.minDuration, overlap);
                    prev.duration -= reduction;
                    overlap -= reduction;
                }

                if (overlap > 0 && !prev.locked) {
                    prev.start -= overlap;
                    if (prev.start < dayStart) {
                        prev.start = dayStart;
                        prev.duration = Math.max(prev.minDuration, current.start - dayStart);
                    }
                }
            }
        }
    }

    /**
     * Propagate changes after a duration or start-time edit
     * @param {Array} activities - sorted by start time
     * @param {Number} dayStart
     * @param {Number} dayEnd
     */
    function propagateAll(activities, dayStart, dayEnd) {
        forwardPropagate(activities, dayEnd);
        backwardPropagate(activities, dayStart);
    }

    return {
        forwardPropagate,
        backwardPropagate,
        propagateAll
    };

})();
