## translate

一个 nodejs 脚本，用来把英文字幕 txt 文件处理成符合 arctime 双语字幕的形式。

### 运行

1.创建 rawText 和 output 文件夹

2.把要处理的 txt 文件放到 rawText 文件夹下

3.node 运行

```
node translate.js
```

### 功能如下

把英文 txt 文件处理成每句单行，

通过 google-translate-open-api 翻译成中文，

英中隔行合并，

写入到新的 txt 文件。