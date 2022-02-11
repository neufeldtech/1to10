export default {
    shiftBy: (playerList, amount) => {
        let remaining = playerList.slice(amount, playerList.length);
        let trimmed = playerList.slice(0, amount);
        let result = remaining.concat(trimmed);
        return result;
    },
    calculateRoundScore(want, got) {
        let baseScore = 10;
        if (got == want) {
            let points = want * 2;
            return baseScore + points;
        } else {
            let penalty = Math.abs(want - got) * 2;
            return baseScore - penalty;
        }
    },
    tricksForRound(r) {
        if (r === 20) {
            return 10;
        }
        if (r > 10) {
            return 20 - r;
        }
        return r;
    },
};