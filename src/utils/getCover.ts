import path from 'path';
import _fs from 'fs';
const fs = _fs.promises;
import { fileURLToPath } from 'url';
import SITE_INFO from '@/config';

// 获取当前模块的目录路径（适配 ES Module）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持的图片扩展名（统一小写匹配）
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']);

/**
 * 获取目录中的所有图片文件
 * @param {string} dir - 图片目录路径
 * @returns {Promise<string[]>} - 图片文件名数组（过滤非图片文件）
 */
async function getImageFiles(dir: string): Promise<string[]> {
  try {
    // 先校验目录是否存在，避免无意义报错
    await fs.access(dir, fs.constants.F_OK);
    const files = await fs.readdir(dir);
    // 过滤出支持的图片文件（忽略大小写）
    return files.filter(file => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()));
  } catch (error) {
    console.error(`读取图片目录失败 [${dir}]:`, (error as Error).message);
    return [];
  }
}

/**
 * Fisher-Yates 洗牌算法 - 随机打乱数组（不修改原数组）
 * @param {T[]} array - 需要打乱的数组
 * @returns {T[]} - 打乱后的新数组
 */
function shuffleArray<T>(array: T[]): T[] {
  // 浅拷贝原数组，避免修改源数据
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 创建图片名称无限迭代器（循环打乱图片顺序）
 * @param {string} dir - 图片目录路径
 * @returns {AsyncGenerator<string, never, never>} - 异步生成器（持续输出图片名）
 */
async function* createImageIterator(dir: string): AsyncGenerator<string, never, never> {
  let images = await getImageFiles(dir);
  
  // 若目录无图片，持续抛出错误（便于业务层捕获处理）
  if (images.length === 0) {
    throw new Error(`图片目录 [${dir}] 中未找到支持的图片文件（支持格式：${Array.from(SUPPORTED_EXTENSIONS).join(', ')}）`);
  }

  // 无限循环：打乱后逐个输出，循环往复
  while (true) {
    const shuffledImages = shuffleArray(images);
    for (const image of shuffledImages) {
      yield image;
    }
  }
}

// 目标图片目录（绝对路径）
const targetDir = path.resolve(__dirname, '../../public/assets/images/banner/');

// 初始化图片迭代器（全局单例，保证打乱顺序连续）
let fileIter: AsyncGenerator<string, never, never>;
try {
  fileIter = createImageIterator(targetDir);
} catch (error) {
  console.error('初始化图片迭代器失败:', (error as Error).message);
  // 异常降级：返回空迭代器（避免程序崩溃）
  fileIter = (async function* () {})() as AsyncGenerator<string, never, never>;
}

/**
 * 随机获取 banner 图片 URL
 * @param {string | null | undefined} filename - 自定义图片文件名（可选）
 * @returns {Promise<string>} - 图片完整 URL（自定义文件名优先，否则随机返回）
 */
export default async function getRandomBannerUrl(
  filename: string | null | undefined
): Promise<string> {
  // 若传入自定义文件名，直接返回完整 URL
  if (filename && typeof filename === 'string') {
    return `${SITE_INFO.Site || ''}/assets/images/banner/${filename.trim()}`;
  }

  try {
    // 从迭代器获取随机图片（循环打乱）
    const { value } = await fileIter.next();
    return `${SITE_INFO.Site || ''}/assets/images/banner/${value || ''}`;
  } catch (error) {
    console.error('获取随机 banner 图片失败:', (error as Error).message);
    // 异常降级：返回空 URL 或默认图片（可根据需求修改）
    return `${SITE_INFO.Site || ''}/assets/images/banner/default.png`;
  }
}
