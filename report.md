# 仓鼠摆一摆 游戏说明文档

汪元标 2016010327 [wang-yb16@mails.tsinghua.edu.cn](wang-yb16@mails.tsinghua.edu.cn)

张欣炜 2016010151 [xw-zhang16@mails.tsinghua.edu.cn](xw-zhang16@mails.tsinghua.edu.cn)

github仓库：[https://github.com/zhangxwww/hamswing](https://github.com/zhangxwww/hamswing)

小程序码

//

---

## 游戏策划与玩法

## 界面布局与设计

## 技术实现方案

## 重点与难点

// 重点

// 物理引擎 ropejoint  碰撞处理

// 难点

// 实现伸出与收回绳子的动画   绳子末端的爪子  无限背景  loadScene

## 游戏测试

## 亮点内容

## 游戏的数值设计

// 松开绳子加速  屋顶反弹  怪物与蘑菇的间距  无敌状态时间  重力加速度

## 游戏的优化

在游戏场景中，仓鼠向前飞跃，前方会不断生成物品，包括星星、蘑菇、云，等等。大部分物品都会很快离开视野范围。如果不及时清理这些物品，那么每一帧的运算量会不断增长，其中包括(1) 更新这些物品坐标，(2) 这些物品的动画效果，(3) 降低全局事件监听的效率，(4) 降低查找结点的效率，最终造成游戏的卡顿。我们通过每过一段时间(100ms)，及时清理屏幕范围外的物品，避免了较长游戏时间后的卡顿问题。

此外，对于在仓鼠前方生成物品，更新分数等操作，它们并不需要每一帧都执行。我们通过setInterval或setTimeOut的方法降低了每一帧的运算量。

## 分工

张欣炜主要完成了项目构建，并对cocos引擎的进行了早期的探索与踩坑，包括物理引擎的使用，事件响应及组件间消息传递的实现方式。实现了游戏主体逻辑，创建游戏中的模型，并为游戏添加了音效。

汪元标提出了多个版本的游戏创意，在其基础上设计了这款游戏。完成了游戏的流程控制，设计了模块框架，实现了场景的逻辑控制。制作了游戏的动画、动作特效，进行了美术设计。

## 参考资料

[1\]  [Cocos Creator v2.0 用户手册](https://docs.cocos.com/creator/manual/zh/)

[2\] [Cocos Creator JavaScript engine API reference](https://docs.cocos.com/creator/api/zh/)