# 三好小狗

《三好小狗》是一款帮助用户监督生活学习习惯的正反馈网页养成小游戏。

核心设定是：用户本人就是“三好小狗”。萨摩耶形象不是被饲养的宠物，而是用户自己的可爱化游戏分身，代表自律、生活规律、学习进步、健康管理和情绪管理。

## 游戏定位

用户每天创建并完成生活学习任务，获得金币、经验和成长反馈。完成任务后，用户自己的“三好小狗”状态会变得更健康、更开心、更聪明、更有活力。金币可以在商店兑换自我奖励/自我照顾道具，道具进入背包后可使用并影响状态。

## 当前功能

- 今日任务：新增、编辑、删除、完成任务
- 默认作息：一键生成起床、早餐、学习、散步、运动、阅读、早睡任务
- 状态系统：健康值、心情值、饱食值、清洁值、聪明值、活力值
- 等级系统：完成任务获得经验，升级后获得金币奖励
- 货币系统：金币、钻石
- 商店系统：购买自我奖励和自我照顾道具
- 背包系统：使用可消耗道具，收藏非消耗道具
- 成就系统：达成自律成长目标后领取奖励
- 日历系统：查看每天完成数、任务数、金币和详情
- 设置系统：导出存档、导入存档、重置游戏数据
- 自动保存：所有核心操作都会写入 localStorage

## 操作说明

1. 打开 `index.html`。
2. 在“首页”或“今日计划”新增任务，或点击“一键生成默认作息”。
3. 点击任务卡片中的“完成”，获得金币、经验和属性变化。
4. 在“商店”使用金币购买道具。
5. 在“背包”使用道具，让三好小狗本狗状态变好。
6. 在“成就”领取已达成奖励。
7. 在“日历”查看每日打卡记录。
8. 在“设置”导出或导入本地存档。

## 文件结构

```text
index.html
styles.css
README.md
src/
  app.js
assets/
  dog/
    samoyed-main.png
    samoyed-logo.png
  tasks/
    wakeup.svg
    breakfast.svg
    study.svg
    sport.svg
    read.svg
    sleep.svg
    walk.svg
    wash.svg
  items/
    dog-food.svg
    ball.svg
    bone.svg
    bath.svg
    dog-bed.svg
    comb.svg
    hat.svg
    feeder.svg
    teddy.svg
    shampoo.svg
```

## 数据存储说明

游戏数据保存在浏览器 `localStorage` 中，键名为：

```text
sanhaoPuppyGameState
```

数据包含金币、钻石、三好小狗等级与属性、任务、背包、成就、日历记录、连续打卡和设置。刷新页面后数据不会丢失。

## 素材来源说明

当前萨摩耶主形象和头像 logo 使用用户提供的本地图片 `C:/Users/23982/Downloads/dog-logo.png`，已复制到：

- `assets/dog/samoyed-main.png`
- `assets/dog/samoyed-logo.png`

任务图标和商店/背包图标仍使用项目本地 SVG 插画，保持暖色、圆润、治愈风格，不依赖外部网络。

后续如果替换为外部 PNG/WebP 素材，建议继续使用相同目录结构，例如：

- `assets/dog/samoyed-main.png`
- `assets/dog/samoyed-logo.png`
- `assets/tasks/wakeup.png`
- `assets/items/dog-food.png`

替换后只需要同步更新 `src/app.js` 中顶部的素材路径。

## 后续可扩展方向

- 音效与按钮反馈
- 更多萨摩耶动作和皮肤
- 小狗装扮系统
- 更完整的自我奖励系统
- 浏览器通知提醒
- 移动端适配优化
- 云同步
- 更细致的日历统计和周报
