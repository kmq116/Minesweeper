interface BlockState {
  x: number;
  y: number;
  revealed: boolean; //是否已经揭开
  flagged?: boolean; //旗子
  mine?: boolean; //炸弹
  adjacentMines: number; //周围的炸弹数量
}

export const directions = [
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

const WIDTH = 10;
const HEIGHT = 10;
// 初始化二维数组 && 随机生成炸弹
export function initData(): BlockState[][] {
  return Array.from({ length: HEIGHT }, (a, x) =>
    Array.from(
      { length: WIDTH },
      (b, y): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
    )
  );
}

export function generateMines(
  initial: BlockState,
  data: BlockState[][]
): BlockState[][] {
  console.log(initial, "初始化的数据");
  console.log(data, "初始化的数据");
  return data.map((item, i) => {
    return item.map((itm, j) => {
      return {
        ...itm,
        revealed: itm.x === initial.x && itm.y === initial.y,
        // 第一次点击的本身不能设置为地雷
        mine:
          itm.y === initial.y && itm.x === initial.x
            ? false
            : Math.random() > 0.9,
      };
    });
  });
}

/**
 * 扫雷翻开的规则是 如果翻开的格子是空 就递归其周围的格子 依次翻开，终止条件是周围的格子有数值
 * @param block
 * @param data
 * @returns
 */
export function expandZero(block: BlockState, data: BlockState[][]) {
  console.log(block, data);
  // 如果是 0 不处理
  // if (block.adjacentMines || block.revealed) return data;
  //  如果翻开的地方是大于 0 的数字，不进行处理
  if (block.adjacentMines || block.revealed) return data;
  getSiblings(block, data).forEach((s) => {
    s.revealed = true;
    expandZero(s, data);
  });
  return data;
}

export function countBombAround(data: BlockState[][]) {
  // 计算周围的炸弹数量格子填空
  for (const row of data) {
    for (const block of row) {
      // 存在炸弹 将其上下左右数字都 加1
      if (block.mine) {
        getSiblings(block, data).forEach((b) => {
          b.adjacentMines++;
        });
        continue;
      }
    }
  }
  return data;
}
// 获取其周围 BlockState
function getSiblings(block: BlockState, data: BlockState[][]) {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      // 越界返回
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return undefined;
      return data[x2][y2];
    })
    .filter(Boolean) as BlockState[];
}
