import { useState } from "react";
interface BlockState {
  x: number;
  y: number;
  revealed?: boolean; //是否已经揭开
  flagged?: boolean; //旗子
  mine?: boolean; //炸弹
  adjacentMines?: number; //周围的炸弹数量
}

function App() {
  const WIDTH = 10;
  const HEIGHT = 10;
  // 初始化数据
  const initState = initData();
  // 计算随机生成的炸弹周围数据显示
  countBombAround(initState);

  const [state, setState] = useState(initState);

  const onClick = (x: number, y: number) => {
    console.log(`Clicked on ${x}, ${y}`);
  };
  return (
    <div className="text-center">
      <div>
        Minesweeper
        {/* <button onClick={generateMines}>点击</button> */}
        <div>
          {state.map((row, yIndex) => {
            return (
              <div key={yIndex}>
                {row.map((item, xIndex) => {
                  return (
                    <button
                      key={xIndex}
                      onClick={() => onClick(xIndex, yIndex)}
                      className="w-10 h-10 border hover:bg-amber-300"
                    >
                      {item.mine ? "💣" : item.adjacentMines || "-"}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 初始化二维数组 && 随机生成炸弹
  function initData(): BlockState[][] {
    return Array.from({ length: HEIGHT }, (a, y) =>
      Array.from({ length: WIDTH }, (b, x): BlockState => ({ x, y }))
    ).map((item) => {
      return item.map((itm) => {
        return { ...itm, mine: Math.random() > 0.8 };
      });
    });
  }
  function updateMineNumber(a: BlockState) {
    if (a.adjacentMines === undefined) {
      a.adjacentMines = 1;
    } else {
      (a.adjacentMines as number) += 1;
    }
  }

  /**
   * 获取其周围 BlockState
   * @param y
   * @param x
   * @returns
   */
  function getAroundData(y: number, x: number): BlockState | undefined {
    if (initState[y] && initState[y][x]) {
      return initState[y][x];
    } else {
      return undefined;
    }
  }

  function countBombAround(data: BlockState[][]) {
    const directions = [
      //八个方向的数据
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    // 计算周围的炸弹数量格子填空
    for (const row of initState) {
      for (const block of row) {
        // 存在炸弹 将其上下左右都 加1
        if (block.mine) {
          const [x, y] = [block.x, block.y];
          directions.forEach(([dy, dx]) => {
            const aroundData = getAroundData(y + dy, x + dx);
            if (aroundData) {
              updateMineNumber(aroundData);
            }
          });
          continue;
        }
      }
    }
  }
}

export default App;
