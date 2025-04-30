import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>前端面试练习</title>
        <meta name="description" content="前端面试练习项目" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">前端面试练习</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">数独游戏</h2>
            <p className="text-gray-600 mb-4">
              一个使用 React 和 TypeScript 实现的数独游戏，包含计时器、难度选择和错误检查功能。
            </p>
            <Link href="/sudoku" className="text-blue-500 hover:text-blue-700 underline">
              开始游戏 →
            </Link>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">轮播图</h2>
            <p className="text-gray-600 mb-4">
              一个使用 React 和 TypeScript 实现的轮播图，包含自动播放和手动切换功能。
            </p>
            <Link href="/carousel" className="text-blue-500 hover:text-blue-700 underline"></Link>
          </div>
        </div>
      </main>
    </div>
  );
}