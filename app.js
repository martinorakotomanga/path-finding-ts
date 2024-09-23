var snake = /** @class */ (function () {
    function snake() {
    }
    snake._createField = function (length) {
        if (length === void 0) { length = 10; }
        for (var i = -1; i <= length; i++) {
            this._ligne = i % 2 == 0 ? '|' : '!';
            for (var j = 0; j <= length; j++) {
                this._ligne += (j == length)
                    ? (i % 2 == 0 ? '|' : '!')
                    : (i == -1 || i == length) ? '---'
                        : (j == this._food[0] && i == this._food[1]) ? ' ♪ '
                            : (j == this._body[0][0] && i == this._body[0][1]) ? ' ♦ '
                                // : (this._isIncludes(this._numberPath, [j, i], false)) ? ' P '
                                : (this._isIncludes(this._stuck, [j, i], false) ? ' * '
                                    : '   ');
            }
            console.log(this._ligne);
        }
    };
    snake._random = function (nbr1, nbr2) {
        return (nbr1) + Math.floor(Math.random() * (nbr2 - nbr1));
    };
    snake._isIncludes = function (tab, coord, isAllCheck) {
        if (isAllCheck) {
            return JSON.stringify(tab).indexOf(JSON.stringify(coord)) > -1 ||
                JSON.stringify(this._body).indexOf(JSON.stringify(coord)) > -1 ||
                JSON.stringify(this._numberPath).indexOf(JSON.stringify(coord)) > -1;
        }
        return JSON.stringify(tab).indexOf(JSON.stringify(coord)) > -1;
    };
    snake._checkDirection = function (head, isAllCheck) {
        if (isAllCheck === void 0) { isAllCheck = true; }
        var _nextPositions = [];
        if ((head[0] - 1) >= 0 && !this._isIncludes(this._stuck, [head[0] - 1, head[1]], isAllCheck)) {
            _nextPositions.push([head[0] - 1, head[1]]);
        }
        if ((head[0] + 1) < this._length && !this._isIncludes(this._stuck, [head[0] + 1, head[1]], isAllCheck)) {
            _nextPositions.push([head[0] + 1, head[1]]);
        }
        if ((head[1] - 1) >= 0 && !this._isIncludes(this._stuck, [head[0], head[1] - 1], isAllCheck)) {
            _nextPositions.push([head[0], head[1] - 1]);
        }
        if ((head[1] + 1) <= this._length && !this._isIncludes(this._stuck, [head[0], head[1] + 1], isAllCheck)) {
            _nextPositions.push([head[0], head[1] + 1]);
        }
        return _nextPositions;
    };
    snake._checkAroundDistance = function (tabCoord) {
        this._numberPath.push([]);
        for (var i = 0; i < tabCoord.length; i++) {
            var directions = this._checkDirection(tabCoord[i]);
            for (var j = 0; j < directions.length; j++) {
                if (this._food[0] == directions[j][0] && this._food[1] == directions[j][1]) {
                    this._existPath = true;
                    this._numberPath[this._numberPath.length - 1] = [directions[j]];
                    this._checkRightPath();
                    return;
                }
                this._numberPath[this._numberPath.length - 1].push(directions[j]);
            }
            ;
        }
        if (this._numberPath[this._numberPath.length - 1].length) {
            return this._checkAroundDistance(this._numberPath[this._numberPath.length - 1]);
        }
        this._numberPath.pop();
    };
    snake._checkRightPath = function () {
        var lastCoord;
        var idx = 0;
        var tabIdx = [];
        var beforeLastTab;
        for (var i = 1; i < this._numberPath.length; i++) {
            lastCoord = this._numberPath[this._numberPath.length - i][0];
            beforeLastTab = this._numberPath[this._numberPath.length - (i + 1)];
            for (var j = 0; j < beforeLastTab.length; j++) {
                if ((Math.abs(lastCoord[0] - beforeLastTab[j][0]) + Math.abs(lastCoord[1] - beforeLastTab[j][1])) == 1) {
                    tabIdx.push(j);
                    continue;
                }
                if (tabIdx.length)
                    break;
            }
            this._numberPath[this._numberPath.length - (i + 1)] = [beforeLastTab[tabIdx.length > 1 ? tabIdx[idx] : tabIdx[0]]];
            idx ^= 1;
            tabIdx = [];
        }
    };
    var _a;
    _a = snake;
    snake._length = 14;
    snake._food = [4, 4];
    snake._existPath = false;
    snake._ligne = '';
    snake._toggleDirection = true;
    snake._body = [[_a._length - 3, _a._length - 4]];
    snake._stuck = [[1, 1], [1, 0], [1, 2], [0, 4], [1, 6], [1, 5], [3, 1], [4, 1], [2, 3], [4, 3], [3, 5], [4, 5]];
    snake._numberPath = [[_a._body[0]]];
    return snake;
}());
console.clear();
snake._checkAroundDistance(snake._numberPath[0]);
console.log(snake._numberPath);
snake._createField(snake._length);
var cpt = 0;
var idx = 0;
console.clear();
var isMoove = setInterval(function () {
    console.clear();
    snake._body[0] = snake._numberPath[cpt][0];
    if (cpt == snake._numberPath.length - 1) {
        snake._numberPath = [[snake._body[0]]];
        snake._existPath = false;
        cpt = 0;
        do {
            snake._food = [snake._random(0, snake._length - 1), snake._random(0, snake._length)];
        } while (snake._isIncludes(snake._stuck, snake._food, true) || snake._food[0] == snake._body[0][0] && snake._food[1] == snake._body[0][1]);
        snake._checkAroundDistance(snake._numberPath[0]);
    }
    if (!snake._existPath) {
        console.log('Aucun chemin existant! partie terminée');
        clearInterval(isMoove);
    }
    snake._createField(snake._length);
    cpt++;
}, 1000);
