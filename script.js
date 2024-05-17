const config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

const game = new Chess();
const board = Chessboard('myBoard', config);

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) {
    return false;
  }
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  setTimeout(makeBestMove, 250);
}

function makeBestMove() {
  if (game.game_over()) {
    alert('Game over');
  }
  const bestMove = minimaxRoot(game, 2, true);
  game.move(bestMove);
  board.position(game.fen());
  if (game.game_over()) {
    alert('Game over');
  }
}

function onSnapEnd() {
  board.position(game.fen());
}

function minimax(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  const moves = game.moves();

  if (maximizingPlayer) {
    let bestMove = -Infinity;
    for (const move of moves) {
      game.move(move);
      const value = minimax(game, depth-1, alpha, beta, false);
      bestMove = Math.max(bestMove, value);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) {
        game.undo();
        break;
      }
      game.undo();
    }
    return bestMove;
  } else {
    let bestMove = +Infinity;
    for (const move of moves) {
      game.move(move);
      const value = minimax(game, depth-1, alpha, beta, true);
      bestMove = Math.min(bestMove, value);
      beta = Math.min(beta, value);
      if (alpha >= beta) {
        game.undo();
        break;
      }
      game.undo();
    }
    return bestMove;
  }
}

function minimaxRoot(game, depth, maximizingPlayer) {
  const moves = game.moves();
  let bestMove = -Infinity;
  let bestMoveFound = null;

  for (const move of moves) {
    game.move(move);
    const value = minimax(game, depth-1, -Infinity, Infinity, !maximizingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = move;
    }
  }

  return bestMoveFound;
}

function evaluateBoard(board) {
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (piece === null) {
    return 0;
  }
  let absoluteValue;
  if (piece.type === 'p') {
    absoluteValue = 10 
  } else if (piece.type === 'n') {
    absoluteValue = 30 
  } else if (piece.type === 'b') {
    absoluteValue = 30 
  } else if (piece.type === 'r') {
    absoluteValue = 50 
  } else if (piece.type === 'q') {
    absoluteValue = 90 
  } else if (piece.type === 'k') {
    absoluteValue = 900
  } else {
    throw Error(`Unknown piece type: ${piece.type}`);
  }

  return piece.color === 'w' ? absoluteValue : -absoluteValue;
}
