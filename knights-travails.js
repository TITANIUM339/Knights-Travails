// Rotates a point 90deg about the origin.
function rotate90deg(point) {
    let [x, y] = point;

    let tmp = x;
    x = -y;
    y = tmp;

    return [x, y];
}

function isMoveLegal(move) {
    return move[0] >= 0 && move[0] <= 7 && move[1] >= 0 && move[1] <= 7;
}

// Returns all possible moves from node.
function getMoves(node) {
    const moves = [];

    let point1 = [1, 2];
    let point2 = [-1, 2];

    for (let i = 0; i < 4; i++) {
        let [x1, y1] = point1;
        let [x2, y2] = point2;

        // Translate points so that node becomes the origin.
        let move1 = [x1 + node[0], y1 + node[1]];
        let move2 = [x2 + node[0], y2 + node[1]];

        if (isMoveLegal(move1)) moves.push(move1);

        if (isMoveLegal(move2)) moves.push(move2);

        point1 = rotate90deg(point1);
        point2 = rotate90deg(point2);
    }

    return moves;
}

// Return the shortest path from start to end.
function knightMoves(start, end) {
    if (!isMoveLegal(start) || !isMoveLegal(end)) return [];

    // Standard 8x8 chess board.
    const board = Array.from(Array(8), () => new Array(8).fill(false));

    const queue = [start];

    // Relationship between parents and children nodes object.
    const relObj = {};

    // BFS.
    while (queue.length) {
        let startNode = queue.shift();

        let moves = getMoves(startNode);

        for (let i = 0; i < moves.length; i++) {
            let [x, y] = moves[i];

            if (!board[x][y]) {
                board[x][y] = true;
                queue.push(moves[i]);

                // Add current node to parent node.
                if (relObj.hasOwnProperty(startNode.join())) {
                    relObj[startNode.join()].push(moves[i].join());
                } else {
                    relObj[startNode.join()] = [moves[i].join()];
                }
            }

            if (x === end[0] && y === end[1]) {
                // Construct shortest path from relObj and return it.
                const relArr = [];

                for (const key in relObj) {
                    relArr.push({ [key]: relObj[key] });
                }

                relArr.reverse();

                const shortestPath = [end.join()];

                let currentNode = Object.keys(relArr[0])[0];

                shortestPath.push(currentNode);

                for (let i = 1; i < relArr.length; i++) {
                    const parentNode = Object.keys(relArr[i])[0];
                    const nodes = relArr[i][Object.keys(relArr[i])[0]];

                    for (let j = 0; j < nodes.length; j++) {
                        if (currentNode === nodes[j]) {
                            shortestPath.push(parentNode);
                            currentNode = parentNode;
                            break;
                        }
                    }
                }

                return shortestPath.reverse();
            }
        }
    }
}

const start = [3, 3];
const end = [4, 3];

console.log(`> knightMoves([${start}],[${end}])`);

const shortestPath = knightMoves(start, end);

console.log(
    `=> You made it in ${shortestPath.length - 1} moves!  Here's your path:`
);

shortestPath.forEach((element) => console.log(`  [${element}]`));
