/**
 * scoring.js
 * Assign scores to candidate schedules for minimal-change selection
 */

window.scoring = (function() {

    /**
     * Compute difference between two schedules
     * @param {Array} original - original schedule
     * @param {Array} candidate - candidate schedule
     * @returns {Object} summary of changes
     */
    function computeChanges(original, candidate) {
        let changes = [];
        for (let i = 0; i < original.length; i++) {
            const o = original[i];
            const c = candidate[i];
            if (!c) continue;

            const startDiff = Math.abs(c.start - o.start);
            const durationDiff = Math.abs(c.duration - o.duration);
            if (startDiff > 0 || durationDiff > 0) {
                changes.push({
                    index: i,
                    startDiff,
                    durationDiff,
                    priority: c.priority || 0
                });
            }
        }
        return changes;
    }

    /**
     * Score a candidate schedule
     * Lower score = better schedule
     * @param {Array} original
     * @param {Array} candidate
     * @returns {Number} score
     */
    function scoreSchedule(original, candidate) {
        const changes = computeChanges(original, candidate);

        if (changes.length === 0) return 0; // perfect match

        // Weighted scoring
        let score = 0;
        changes.forEach(c => {
            // Priority: higher priority activity changes cost more
            const priorityFactor = (c.priority + 1); // avoid 0
            score += priorityFactor * (c.startDiff + c.durationDiff);
        });

        // Additional penalty for number of activities changed
        score += changes.length * 10;

        return score;
    }

    /**
     * Compare multiple candidate schedules
     * @param {Array} original
     * @param {Array} candidates - array of schedules
     * @returns {Object} { bestSchedule, bestScore, allScores }
     */
    function selectBestSchedule(original, candidates) {
        let bestScore = Infinity;
        let bestSchedule = null;
        let allScores = [];

        candidates.forEach(candidate => {
            const score = scoreSchedule(original, candidate);
            allScores.push({ candidate, score });
            if (score < bestScore) {
                bestScore = score;
                bestSchedule = candidate;
            }
        });

        return { bestSchedule, bestScore, allScores };
    }

    return {
        computeChanges,
        scoreSchedule,
        selectBestSchedule
    };

})();
