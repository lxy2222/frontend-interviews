import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// 数独游戏组件
const SudokuGame = () => {
  // 初始空棋盘
  const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // 状态管理
  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [solution, setSolution] = useState<number[][]>(emptyBoard);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [initialBoard, setInitialBoard] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && gameStatus === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, gameStatus]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 生成有效的数独解决方案
  const generateSolution = (): number[][] => {
    const newBoard = Array(9).fill(null).map(() => Array(9).fill(0));
    
    const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
      // 检查行
      for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
      }
      
      // 检查列
      for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
      }
      
      // 检查3x3方格
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i + startRow][j + startCol] === num) return false;
        }
      }
      
      return true;
    };
    
    const solve = (board: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            // 随机打乱数字顺序，使生成的数独更有变化
            for (let i = numbers.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }
            
            for (const num of numbers) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve(board)) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    
    solve(newBoard);
    return newBoard;
  };

  // 根据难度移除数字
  const removeNumbers = (board: number[][], difficulty: 'easy' | 'medium' | 'hard'): [number[][], boolean[][]] => {
    const cellsToRemove = {
      easy: 30,
      medium: 40,
      hard: 50
    };
    
    const newBoard = JSON.parse(JSON.stringify(board));
    const initialPositions = Array(9).fill(null).map(() => Array(9).fill(false));
    
    // 记录初始数字的位置
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        initialPositions[i][j] = true;
      }
    }
    
    // 随机移除数字
    let count = 0;
    while (count < cellsToRemove[difficulty]) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (newBoard[row][col] !== 0) {
        newBoard[row][col] = 0;
        initialPositions[row][col] = false;
        count++;
      }
    }
    
    return [newBoard, initialPositions];
  };

  // 开始新游戏
  const startNewGame = () => {
    const newSolution = generateSolution();
    const [newBoard, newInitialPositions] = removeNumbers(newSolution, difficulty);
    
    setBoard(newBoard);
    setSolution(newSolution);
    setInitialBoard(newInitialPositions);
    setSelectedCell(null);
    setGameStatus('playing');
    setMistakes(0);
    setTimer(0);
    setIsPaused(false);
  };

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || initialBoard[row][col]) return;
    setSelectedCell([row, col]);
  };

  // 处理数字输入
  const handleNumberInput = (num: number) => {
    if (!selectedCell || gameStatus !== 'playing') return;
    
    const [row, col] = selectedCell;
    if (initialBoard[row][col]) return;
    
    const newBoard = [...board];
    newBoard[row][col] = num;
    setBoard(newBoard);
    
    // 检查输入是否正确
    if (num !== solution[row][col]) {
      setMistakes(prev => prev + 1);
      if (mistakes + 1 >= 3) {
        setGameStatus('lost');
      }
    } else {
      // 检查是否完成
      if (isBoardComplete(newBoard)) {
        setGameStatus('won');
      }
    }
  };

  // 检查棋盘是否完成
  const isBoardComplete = (currentBoard: number[][]): boolean => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  // 处理擦除
  const handleErase = () => {
    if (!selectedCell || gameStatus !== 'playing') return;
    
    const [row, col] = selectedCell;
    if (initialBoard[row][col]) return;
    
    const newBoard = [...board];
    newBoard[row][col] = 0;
    setBoard(newBoard);
  };

  // 处理暂停/继续
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // 渲染数字按钮
  const renderNumberButtons = () => {
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleNumberInput(num)}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };

  // 渲染控制按钮
  const renderControlButtons = () => {
    return (
      <div className="flex justify-between mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleErase}
        >
          擦除
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          onClick={togglePause}
        >
          {isPaused ? '继续' : '暂停'}
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={startNewGame}
        >
          新游戏
        </button>
      </div>
    );
  };

  // 渲染难度选择
  const renderDifficultySelector = () => {
    return (
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className={`px-4 py-2 rounded ${difficulty === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setDifficulty('easy')}
        >
          简单
        </button>
        <button
          className={`px-4 py-2 rounded ${difficulty === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setDifficulty('medium')}
        >
          中等
        </button>
        <button
          className={`px-4 py-2 rounded ${difficulty === 'hard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setDifficulty('hard')}
        >
          困难
        </button>
      </div>
    );
  };

  // 渲染游戏状态
  const renderGameStatus = () => {
    if (gameStatus === 'won') {
      return (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <h3 className="text-xl font-bold">恭喜！你赢了！</h3>
          <p>用时: {formatTime(timer)}</p>
          <button
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={startNewGame}
          >
            再来一局
          </button>
        </div>
      );
    }
    
    if (gameStatus === 'lost') {
      return (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h3 className="text-xl font-bold">游戏结束</h3>
          <p>错误次数过多</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={startNewGame}
          >
            再来一局
          </button>
        </div>
      );
    }
    
    return null;
  };

  // 渲染数独棋盘
  const renderBoard = () => {
    return (
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
            const isInitial = initialBoard[rowIndex][colIndex];
            const isCorrect = cell === solution[rowIndex][colIndex];
            const isWrong = cell !== 0 && !isCorrect;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-10 h-10 flex items-center justify-center border border-gray-300
                  ${(rowIndex + 1) % 3 === 0 ? 'border-b-2 border-gray-800' : ''}
                  ${(colIndex + 1) % 3 === 0 ? 'border-r-2 border-gray-800' : ''}
                  ${isSelected ? 'bg-blue-200' : ''}
                  ${isInitial ? 'font-bold' : ''}
                  ${isWrong ? 'text-red-500' : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  // 初始化游戏
  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Head>
        <title>数独游戏</title>
        <meta name="description" content="一个简单的数独游戏" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">数独游戏</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            错误: <span className="font-bold">{mistakes}/3</span>
          </div>
          <div className="text-lg">
            时间: <span className="font-bold">{formatTime(timer)}</span>
          </div>
        </div>
        
        {renderDifficultySelector()}
        
        <div className="flex justify-center my-6">
          {renderBoard()}
        </div>
        
        {renderNumberButtons()}
        {renderControlButtons()}
        {renderGameStatus()}
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
};

export default function SudokuPage() {
  return <SudokuGame />;
} 