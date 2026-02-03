import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
// 设置中文语言环境
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn');
// 获取文章的描述
const getDescription = (post: any, num: number = 150) => (post.rendered ? post.rendered.html.replace(/<[^>]+>/g, "").replace(/\s+/g, "") : post.body.replace(/\n/g, "").replace(/#/g, "")).slice(0, num) || '暂无简介'
//处理时间
const fmtTime = (time: any, fmt: string = 'MMMM D, YYYY') => dayjs(time).utc().format(fmt)
// 处理日期：新增totalDays参数，true=返回总天数，false=原格式，hours_status保留原逻辑
const fmtDate = (time: string | Date, hours_status = true, totalDays = false) => {
  const now = dayjs();
  const past = dayjs(time);
  // 新增：直接计算当前时间与目标时间的总天数差（向下取整）
  if (totalDays) {
    const total = now.diff(past, 'day');
    return total < 1 ? '1' : total.toString();
  }
  // 以下为原代码，无任何修改
  const years = now.diff(past, 'year');
  const adjustedPastYears = past.add(years, 'year');
  const months = now.diff(adjustedPastYears, 'month');
  const adjustedPastMonths = adjustedPastYears.add(months, 'month');
  const days = now.diff(adjustedPastMonths, 'day');
  const adjustedPastDays = adjustedPastMonths.add(days, 'day');
  const hours = now.diff(adjustedPastDays, 'hour');
  const adjustedPastHours = adjustedPastDays.add(hours, 'hour');
  const minutes = now.diff(adjustedPastHours, 'minute');
  const adjustedPastMinutes = adjustedPastHours.add(minutes, 'minute');
  const seconds = now.diff(adjustedPastMinutes, 'second');
  return [
    years && `${years}年`,
    months && `${months}月`,
    days && `${days}天`,
    (hours_status || days === 0) ? hours && !years && !months && `${hours}小时` : 0,
    hours_status ? minutes && !years && !months && !days && `${minutes}分` : '',
    hours_status ? seconds && !years && !months && !days && !hours && `${seconds}秒` : ''
  ].filter(Boolean).join('');
};

// 处理页码展示
const fmtPage = (page: string | undefined) => page ? page.replace(/\//g, '') : null
// 加载外部脚本
const LoadScript = (
  src: string,
  attrs?: Array<{ k: string; v: string | boolean }>
): Promise<HTMLScriptElement> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    if (attrs?.length) {
      attrs.forEach(({ k, v }) => {
        const value = typeof v === "boolean"
          ? (v ? "" : null)
          : String(v);
        if (value !== null) script.setAttribute(k, value);
      });
    }
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};
// 加载外部CSS
const LoadStyle = (href: string): Promise<HTMLLinkElement> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
    document.head.appendChild(link);
  });
}

// 请求封装
const $GET = async (url: string, headers: Record<string, string> = {}): Promise<any> => {
  try {
    const res = await fetch(url, { method: "GET", headers: headers, });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("GET request failed:", error);
  }
};

const $POST = async (url: string, data: Record<string, any>, headers: Record<string, string> = {}): Promise<any> => {
  try {
    const res = await fetch(url, { method: "POST", headers: { ...headers, }, body: JSON.stringify(data), });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("POST request failed:", error);
  }
};

export { $GET, $POST, getDescription, fmtTime, fmtDate, fmtPage, LoadScript, LoadStyle }
