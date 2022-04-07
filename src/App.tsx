import { useState } from "react";
import {
  countBombAround,
  expandZero,
  generateMines,
  initData,
} from "./Minesweeper";

let mineGenerated = false;
let dev = false;
function App() {
  console.log("App", mineGenerated);

  // 初始化数据
  const initState = initData();
  // 计算随机生成的炸弹周围数据显示

  const [state, setState] = useState(initState);
  const onClick = (x: number, y: number) => {
    console.log("onClick", x, y);
    //  防止第一次就点击炸弹 所以点击第一个盒子的时候进行生成炸弹
    if (!mineGenerated) {
      mineGenerated = true;
      return setState(countBombAround(generateMines(state[x][y], initState)));
    }

    // 扫描到雷游戏结束 最基本逻辑
    if (state[x][y].mine) {
      setState(
        state.map((row, rowIndex) => {
          return row.map((block, blockIndex) => {
            return { ...block, revealed: true };
          });
        })
      );
      return alert("你输了");
    }
    setState(expandZero(state[x][y], state));

    const result = state.map((row, rowIndex) => {
      return row.map((block, blockIndex) => {
        if (blockIndex === y && rowIndex === x) {
          block.revealed = true;
        }
        return block;
      });
    });

    setState(result);
  };
  return (
    <div className="text-center flex justify-center">
      <div>
        Minesweeper
        {/* <button onClick={generateMines}>点击</button> */}
        <div>
          {state.map((row, xIndex) => {
            return (
              <div className="flex" key={xIndex}>
                {row.map((item, yIndex) => {
                  return item.revealed || dev ? (
                    <button
                      key={yIndex}
                      className={
                        item.mine
                          ? "bg-red-500 w-10 h-10 border hover:bg-amber-300"
                          : "bg-#bfa-100 w-10 h-10 border hover:bg-amber-300"
                      }
                      onClick={() => onClick(xIndex, yIndex)}
                    >
                      {item.mine ? "💣" : item.adjacentMines || ""}
                    </button>
                  ) : (
                    <button
                      key={yIndex}
                      onClick={() => onClick(xIndex, yIndex)}
                      className="w-10 h-10 border hover:bg-amber-300 bg-slate-500"
                    ></button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
