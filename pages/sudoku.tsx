import React, { useState, useEffect, useCallback, useMemo } from "react";
import classNames from "classnames";

// first step render a fixed grid
// will not introduce any time limit;
// will not introduce any mistake tracking;
// will not introduce any timer;
// will not introduce any difficulty selection;
const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
const SudokuGame = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [initialPositions, setInitialPositions] = useState(Array.from({ length: 9}, () => Array(9).fill(false)));

  // 预先计算每个行、列和方块的可用数字
  const getAvailableNumbers = (board: number[][], row: number, col: number): number[] => {
    const used = new Set<number>();
    // 检查行
    for (let i = 0; i < 9; i++) {
      if (board[row][i] !== 0) used.add(board[row][i]);
    }
    // 检查列
    for (let i = 0; i < 9; i++) {
      if (board[i][col] !== 0) used.add(board[i][col]);
    }
    // 检查方块
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] !== 0) used.add(board[boxRow + i][boxCol + j]);
      }
    }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !used.has(num));
  };

  const generateSolution = (): number[][] => {
    const newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    const solve = (board: number[][]): boolean => {
      // 找到下一个空格
      let row = -1, col = -1;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            row = i;
            col = j;
            break;
          }
        }
        if (row !== -1) break;
      }
      // 如果没有空格，说明已经填完了
      if (row === -1) return true;
      // 获取可用的数字
      const availableNumbers = getAvailableNumbers(board, row, col);
      // 随机打乱可用数字的顺序
      for (let i = availableNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
      }
      // 尝试每个可用数字
      for (const num of availableNumbers) {
        board[row][col] = num;
        if (solve(board)) return true;
        board[row][col] = 0;
      }
      return false;
    };

    if (!solve(newBoard)) {
      return Array.from({ length: 9 }, () => Array(9).fill(0));
    }
    return newBoard;
  };

  // 使用更高效的方法来复制棋盘
  const removeNumbers = (board: number[][]) => {
    const newBoard = board.map(row => [...row]);
    const initialPositions = Array.from({ length: 9}, () => Array(9).fill(true));
    let count = 0;
    const removeCount = 40;
    while (count < removeCount) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (newBoard[row][col] !== 0) {
        newBoard[row][col] = 0;
        initialPositions[row][col] = false;
        count++;
      }
    }
    return [newBoard, initialPositions];
  }

  const startNewGame = useCallback(() => {
    const solution = generateSolution();
    // setBoard(solution);
    const [board, initialPositions] = removeNumbers(solution);
    setBoard(board);
    setInitialPositions(initialPositions);
  }, [])

  const renderBoard = useMemo(() => {
    return (
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isInitial = initialPositions[rowIndex][colIndex];
            return (
              <div key={`${rowIndex}-${colIndex}`} className={`
                 w-10 h-10 flex items-center justify-center border border-gray-300
                  ${(rowIndex + 1) % 3 === 0 ? 'border-b-2 border-gray-800' : ''}
                  ${(colIndex + 1) % 3 === 0 ? 'border-r-2 border-gray-800' : ''}
              `}>
              {cell !== 0 ? cell : ''}
            </div>
            )
          })
        ))}
      </div>
    )
  }, [board, initialPositions])

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">数独游戏</h1>
      <div className="my-6 max-w-md">
        {renderBoard}
      </div>
    </div>
  )

}
export default function SudokuPage() {
  return <SudokuGame />
}