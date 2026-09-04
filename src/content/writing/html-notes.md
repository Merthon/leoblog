---
title: "HTML 学习笔记"
description: "HTML(HyperText Markup Language，超文本标记语言）是一种用来告知浏览器如何组织页面的标记语言。"
publishedAt: 2023-05-25
type: technical
tags: ["HTML"]
draft: false
readingMinutes: 29
---
## HTML
### 1.什么是HTML？
  HTML(HyperText Markup Language，超文本标记语言）是一种用来告知浏览器如何组织页面的***标记语言***。HTML 由一系列的组成，这些元素可以用来包围或_标记_不同部分的内容，使其以某种方式呈现或者工作。
  >**注意**：HTML 标签不区分大小写。也就是说，输入标签时既可以使用大写字母也可以使用小写字母。例如，标签`<title>` 可以写作 `<title>`、`<TITLE>`、`<Title>`、`<TiTlE>` 等，也都可以正常工作。不过，从一致性、可读性来说，最好仅使用小写字母。
### 2.元素
#### 结构
```
<p>My cat is very grumpy</p>
```
主要部分有：
* **开始标签**（Opening tag）：包含元素的名称，被左、右角括号所包围。开头标签标志着元素开始或开始生效的地方。
* **内容**（Content）：元素的内容。
* **结束标签**（Closing tag）：与开始标签相似，只是其在元素名之前包含了一个斜杠。这标志着该元素的结束。
整个元素即指开始标签、内容、结束标签三部分组成的整体。
#### 嵌套元素
你也可以把元素放到其他元素之中——这被称作*嵌套*。
```
<p>My cat is <strong>very</strong> grumpy.</p>
```
#### 块级元素和内联元素
* 块级元素在页面中以块的形式展现。一个块级元素出现在它前面的内容之后的新行上。任何跟在块级元素后面的内容也会出现在新的行上。块级元素通常是页面上的结构元素。例如，一个块级元素可能代表标题、段落、列表、导航菜单或页脚。一个块级元素不会嵌套在一个内联元素里面，但它可能嵌套在另一个块级元素里面。
* 内联元素通常出现在块级元素中并环绕文档内容的一小部分，而不是一整个段落或者一组内容。内联元素不会导致文本换行，它通常与文本一起使用。

#### 空元素
不是所有元素都拥有开始标签、内容和结束标签。一些元素只有一个标签，通常用来在此元素所在位置插入/嵌入一些东西。这些元素被称为空元素。

#### 无语义元素
对于一些要组织的项目或要包装的内容，现有的语义元素均不能很好对应。有时候你可能只想将一组元素作为一个单独的实体来修饰来响应单一的用 [CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS) 或 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Glossary/JavaScript)。为了应对这种情况，HTML 提供了 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div) 和 [`<span>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span) 元素。应配合使用 [`class`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#class) 属性提供一些标签，使这些元素能易于查询。
##### `<span>`标签
一个内联的（inline）无语义元素，最好只用于无法找到更好的语义元素来包含内容时，或者不想增加特定的含义时。例如：
```
<p>国王喝得酩酊大醉，在凌晨 1 点时才回到自己的房间，踉跄地走过门口。<span class="editor-note">[编辑批注：此刻舞台灯光应变暗]</span>.</p>
```
##### `<div>`标签
一个块级无语义元素，应仅用于找不到更好的块级元素时，或者不想增加特定的意义时。例如，一个电子商务网站页面上有一个一直显示的购物车组件。
```
<div class="shopping-cart">
  <h2>购物车</h2>
  <ul>
    <li>
      <p><a href=""><strong>银耳环</strong></a>：$99.95.</p>
      <img src="../products/3333-0985/" alt="Silver earrings">
    </li>
    <li>
      ...
    </li>
  </ul>
  <p>售价：$237.89</p>
</div>
```

#### 多媒体和嵌入
##### 图片
用`<img>` 元素来把图片放到网页上。它是一个空元素（它不需要包含文本内容或闭合标签），最少只需要一个 `src` （一般读作其全称 *source）*来使其生效。`src` 属性包含了指向我们想要引入的图片的路径，可以是相对路径或绝对 URL，就像 `<a>`元素的 `href` 属性一样。
```
<img src="images/dinosaur.jpg">
```
###### 图片属性
1. `alt`，它的值应该是对图片的文字描述，用于在图片无法显示或不能被看到的情况。
2. 宽度和高度（`width` `height`）指定你的图片的高度和宽度。
3. `title` ,类似于超链接，来提供需要更进一步的支持信息。
###### `figure`和`figcaption`
这个标签为图片提供一个语义容器，在标题和图片之间建立清晰的关联，比如让你添加一段说明文字来搭配图片，我们可以这样：
```
<div class="figure">
  <img src="/images/dinosaur_small.jpg"
     alt="一只恐龙头部和躯干的骨架，它有一个巨大的头，长着锋利的牙齿。"
     width="400"
     height="341">
  <p>曼彻斯特大学博物馆展出的一只霸王龙的化石</p>
</div>
```
通过`figure`和`figcaption`，我们可以改为：
```
<figure>
  <img src="https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/images-in-html/dinosaur_small.jpg"
      alt="一只恐龙头部和躯干的骨架，它有一个巨大的头，长着锋利的牙齿。"
      width="400"
      height="341">
  <figcaption>曼彻斯特大学博物馆展出的一只霸王龙的化石</figcaption>
</figure>
```
##### 视频和音频
###### 视频
`<video>`允许你轻松地嵌入一段视频。一个简单的例子如下：
```
<video src="rabbit320.webm" controls>
  <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>
```
属性有：
`src`：同 `<img>`标签使用方式相同，`src` 属性指向你想要嵌入网页当中的视频资源，他们的使用方式完全相同。
`controls`：用户必须能够控制视频和音频的回放功能。
`width`和 `height`：你可以用属性控制视频的尺寸，也可以用 [CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS) 来控制视频尺寸。无论使用哪种方式，视频都会保持它原始的长宽比 — 也叫做**纵横比**。如果你设置的尺寸没有保持视频原始长宽比，那么视频边框将会拉伸，而未被视频内容填充的部分，将会显示默认的背景颜色。
`autoplay`：这个属性会使音频和视频内容立即播放，即使页面的其他部分还没有加载完全。
`loop`：这个属性可以让音频或者视频文件循环播放。同样不建议使用，除非有必要。
`muted`：这个属性会导致媒体播放时，默认关闭声音。
`poster`：这个属性指向了一个图像的 URL，这个图像会在视频播放前显示。通常用于粗略的预览或者广告。
`preload`：这个属性被用来缓冲较大的文件，有 3 个值可选：
-   `"none"` ：不缓冲
-   `"auto"` ：页面加载后缓存媒体文件
-   `"metadata"` ：仅缓冲文件的元数据
###### 音频
`<audio>` 标签与 `<video>`标签的使用方式几乎完全相同，有一些细微的差别。不支持 `width`/`height` 属性 — 由于其并没有视觉部件，也就没有可以设置 `width`/`height` 的内容。-   同时也不支持 `poster` 属性 — 同样，没有视觉部件。
###### 其他嵌入技术
`<iframe>` `<odject>` `<embed>`
### 3.属性
元素也可以拥有属性，属性看起来像这样：
~~~
<p class="editor">12334455</p>
~~~
属性包含元素的额外信息，这些信息不会出现在实际的内容中。

属性必须包含：
>1. 一个空格，它在属性和元素名称之间。如果一个元素具有多个属性，则每个属性之间必须由空格分隔。
>2. 属性名称，后面跟着一个等于号。
>3. 一个属性值，由一对引号（""）引起来
#### 实例（为元素添加属性）
关于元素 `<a>`的——元素 `<a>` 是锚，它使被标签包裹的内容成为一个超链接。锚元素可以添加多种属性，部分如下：
`href`
    这个属性声明超链接的 web 地址。例如 `href="https://www.mozilla.org/"`。
`title`
     `title` 属性为超链接声明额外的信息，比如你将链接至的那个页面。例如 `title="The Mozilla homepage"`。当鼠标悬停在超链接上面时，这部分信息将以工具提示的形式显示。
`target`
     `target` 属性用于指定链接如何呈现出来。例如，`target="_blank"` 将在新标签页中显示链接。如果你希望在当前标签页显示链接，忽略这个属性即可。
```
<p>A link to my <a href="https://www.mozilla.org/" title="The Mozilla homepage" target="_blank">favorite website</a>.</p>
```
#### 布尔属性
   有时你会看到没有值的属性，这也是完全可以接受的。这些属性被称为布尔属性。布尔属性只能有一个值，这个值一般与属性名称相同。

### 4.元信息
~~~
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>我的测试站点</title>
  </head>
  <body>
    <p>这是我的页面</p>
  </body>
</html>
~~~
1. `<!DOCTYPE html>`: 声明文档类型。早期的 HTML（大约 1991-1992 年）文档类型声明类似于链接，规定了 HTML 页面必须遵从的良好规则，能自动检测错误和其他有用的东西。
2.  `<html></html>`: `<html>`元素。这个元素包裹了页面中所有的内容，有时被称为根元素。
3. `<head></head>`: `<head>` HTML 页面中但**不在 HTML 页面中显示**的内容。这些内容包括你想在搜索结果中出现的关键字和页面描述、CSS 样式、字符集声明等等.
4. `<meta charset="utf-8">`: [`<meta>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta) 元素。这个元素代表了不能由其他 HTML 元相关元素表示的元数据charset`属性将你的文档的字符集设置为 UTF-8。
5. `<title></title>`: [`<title>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/title) 元素。这设置了页面的标题，也就是出现在该页面加载的浏览器标签中的内容。当页面被加入书签时，页面标题也被用来描述该页面。
6.  `<body></body>`: [`<body>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body) 元素。包含了你访问页面时_所有_显示在页面上的内容，包含文本、图片、视频、游戏、可播放音频轨道等等。
#### 元数据：`<meta>`元素
元数据就是描述数据的数据，而 HTML 有一个“官方的”方式来为一个文档添加元数据——[`<meta>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta) 元素。
##### 指定文档中的字符编码
~~~
<meta charset="utf-8" />
~~~
这个元素简单的指定了文档的字符编码——在这个文档中被允许使用的字符集。`utf-8` 是一个通用的字符集，它包含了任何人类语言中的大部分的字符，意味着该 web 页面可以显示任意的语言；
##### 添加作者和描述
许多 `<meta>` 元素包含了 `name` 和 `content` 属性：

-   `name` 指定了 meta 元素的类型；说明该元素包含了什么类型的信息。
-   `content` 指定了实际的元数据内容。

这两个 meta 元素对于定义你的页面的作者和提供页面的简要描述是很有用的。让我们看一个例子：
~~~
<meta name="author" content="Chris Mills" />
<meta
  name="description"
  content="The MDN Web Docs Learning Area aims to provide
complete beginners to the Web with all they need to know to get
started with developing web sites and applications." />
~~~
指定作者在某些情况下是很有用的：如果你需要联系页面的作者，问一些关于页面内容的问题。一些内容管理系统能够自动获取页面作者的信息，然后用于某些用途。
指定一个包括与你的页面内容有关的关键词的描述是有用的，因为它有可能使你的页面在搜索引擎进行的相关搜索中出现得更多

### 5.特殊字符
在 HTML 中，字符 `<`、`>`、`"`、`'` 和 `&` 是特殊字符。它们是 HTML 语法自身的一部分：
| 原义字符 | 等价字符引用 |
|----|----|
| <  | &lt; |
| >  | &gt; |
| "  | &quot; |
| '  | &apos; |
| &  | &amp; |


### 6.文本
#### 标题和段落
大部分结构化文本由标题和段落组成。
在 HTML 中，每个段落是通过 `<p>`元素标签进行定义的，比如下面这样：
~~~
<p>这是一个段落</p>
~~~
每个标题（Heading）都必须被包裹在一个标题元素中：
~~~
<h1>标题</h1>
~~~
总共有六种标题元素标签——[h1](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)、[h2](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)、[h3](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)、[h4](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)、[h5](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements) 和 [h6](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements)。每个元素代表文档中不同级别的内容：`<h1>` 表示主标题，`<h2>` 表示二级子标题，`<h3>` 表示三级子标题，依此类推。

#### 列表
##### 列表项（List items）`<li>`
~~~
li>沿这条路走到头</li>
  <li>右转</li>
  <li>直行穿过第一个十字路口</li>
  <li>在第三个十字路口处左转</li>
  <li>继续走 300 米，学校就在你的右手边</li>
~~~
##### 无序列表
无序列表（Unordered list）`<ul>`用于标记列表项目顺序无关紧要的列表
```
<ul>
  <li>豆浆</li>
  <li>油条</li>
  <li>豆汁</li>
  <li>焦圈</li>
</ul>
```
##### 有序列表
有序列表（Ordered list）`<ol>`需要按照项目的顺序列出来
```
<ol>
  <li>沿这条路走到头</li>
  <li>右转</li>
  <li>直行穿过第一个十字路口</li>
  <li>在第三个十字路口处左转</li>
  <li>继续走 300 米，学校就在你的右手边</li>
</ol>
```
##### 描述列表
**描述列表**（description list）。这种列表的目的是标记一组项目及其相关描述，例如术语和定义，或者是问题和答案等。
描述列表使用与其他列表类型不同的闭合标签——`<dl>`；此外，每一项都用 `<dt>`（description term）元素闭合。每个描述都用 [`<dd>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/dd)（description definition）元素闭合。
```
<dl>
  <dt>旁白</dt>
  <dd>
    戏剧中，为渲染幽默或戏剧性效果而进行的场景之外的补充注释念白
  <dd>
    写作中，指与当前主题相关的一段内容，通常不适于直接置于内容主线中
  </dd>
</dl>
```
#### 强调
##### 斜体和加粗
  在 HTML 中我们用 [`<em>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/em)（emphasis）元素来标记这样的情况。这样做既可以让文档读起来更有趣，也可以被屏幕阅读器识别，并以不同的语调发出。
  ```
<p>我很<em>庆幸</em>你没有<em>迟到</em>。</p>
```
  在 HTML 中我们用 [`<strong>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/strong)（strong importance）元素来标记这样的情况。除了使文档更有用之外，也可以被屏幕阅读器识别，并以不同的语调发出。
```
<p>这杯液体<strong>毒性很大</strong>。</p>

<p>就指望你了，千万<strong>不要</strong>迟到！</p>
```

#### 文本进阶
##### 引用
HTML 也有用于标记引用的特性，至于使用哪个元素标记，取决于你引用的是一块还是一行。
###### 块引用
如果一个块级内容（一个段落、多个段落、一个列表等）从其他地方被引用，你应该把它用 [`<blockquote>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/blockquote) 元素包裹起来表示，并且在 [`cite`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/blockquote#cite) 属性里用 URL 来指向引用的资源。例如，下面的示例代码就是引用的 MDN 的 `<blockquote>` 元素页面：
```
<p>Here is a blockquote:</p>
<blockquote
  cite="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote">
  <p>
    The <strong>HTML <code>&lt;blockquote&gt;</code> Element</strong> (or
    <em>HTML Block Quotation Element</em>) indicates that the enclosed text is
    an extended quotation.
  </p>
</blockquote>
```

###### 行引用
除了使用 [`<q>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/q) 元素以外，行内元素用同样的方式工作。例如，下面的标记包含了从 MDN `<q>` 页面的引用：
```
<p>The quote element — <code>&lt;q&gt;</code> — is <q cite="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q">intended
for short quotations that don't require paragraph breaks.</q></p>
```

##### 缩略语
Web 上看到的相当常见的元素是 [`<abbr>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/abbr)——它常被用来包裹一个缩略语或缩写，并且提供缩写的解释。当包括这两种情况时，在第一次使用时提供纯文本的完整扩展，同时用 `<abbr>` 来标记缩写。这为用户代理提供了如何公布/显示内容的提示，同时告知所有用户该缩写的含义。
如果为缩写提供扩展信息的意义不大，而且该缩写或首字母缩写是一个相当简短的术语，则应提供该术语的完整扩展，作为 [`title`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#title) 属性的值：
```
<p>
  我们使用 <abbr titl

  e="超文本标记语言（Hyper text Markup Language）">HTML</abbr> 来组织网页文档。
</p>

<p>
  第 33 届<abbr title="夏季奥林匹克运动会">奥运会</abbr>将于 2024 年 8 月在法国巴黎举行。
</p>
```

##### 标记联系方式
HTML 有个用于标记联系方式的元素——[`<address>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/address)。它仅仅包含联系方式，例如：
```
<address>Chris Mills, Manchester, The Grim North, UK</address>
```
##### 上标和下标
当你使用日期、化学方程式、和数学方程式时会偶尔使用上标和下标，以确保它们的正确含义。[`<sup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sup) 和 [`<sub>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/sub) 元素可以解决这样的问题。例如：
```
<p>
  咖啡因的化学方程式是
  C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。
</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>
```

##### 代码
有大量的 HTML 元素可以来标记计算机代码：

-   [`<code>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/code)：用于标记计算机通用代码。
-   [`<pre>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/pre)：用于保留空白字符（通常用于代码块）——如果文本中使用了缩进或多余的空白，浏览器将忽略它，你将不会在呈现的页面上看到它。但是，如果你将文本包含在 `<pre></pre>` 标签中，那么空白将会以与你在文本编辑器中看到的相同的方式渲染出来。
-   [`<var>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/var)：用于标记具体变量名。
-   [`<kbd>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/kbd)：用于标记输入电脑的键盘（或其他类型）输入。
-   [`<samp>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/samp)：用于标记计算机程序的输出。

##### 时间和日期
HTML 还支持将时间和日期标记为可供机器识别的格式的 [`<time>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/time) 元素，例如：
```
<time datetime="2016-01-20">2016 年 1 月 20 日</time>
```

##### 换行与水平分割线
`<br>` 换行
`<br>` 可在段落中进行换行；`<br>` 是唯一能够生成多个短行结构（例如邮寄地址或诗歌）的元素
`<hr>` 主题性中断元素
`<hr>` 元素在文档中生成一条水平分割线，表示文本中主题的变化（例如话题或场景的改变）。一般就是一条水平的直线。
#### 表格
##### 基础
表格是由行和列组成的结构化数据集（表格数据），它让你快速简单地查找某个表示不同类型数据之间的某种关系的值。
* 每一个表格的内容都包含在这两个标签中：**`<table></table>`**。
* 在表格中，最小的内容容器是单元格，是通过 **`<td>`** 元素创建的（其中“td”代表“table data”）。
* 通过`<tr>`元素（其中“tr”代表“table row”），增加行数。
```
<tr>
  <td>Hi, I'm your first cell.</td>
  <td>I'm your second cell.</td>
  <td>I'm your third cell.</td>
  <td>I'm your fourth cell.</td>
</tr>
```
* 为了将表格的标题在视觉上和语义上都能被识别为标题，你可以使用 **`<th>`** 元素（其中 'th' 代表 'table header'），用法和 `<td>`是一样的，除了它表示为标题，不是普通的单元格以外。进入你的 HTML 文件，将表格中应该是标题的 `<td>` 元素标记的内容，都改为用 `<th>` 元素标记。
* 跨行和跨列： `colspan` 和 `rowspan` 属性，这两个属性可以帮助我们实现这些效果。这两个属性接受一个没有单位的数字值，数字决定了它们的宽度或高度是几个单元格。
* 定义整列数据的样式信息： **`<col>`** 和 **`<colgroup>`** 元素。它们存在是因为如果你想让一列中的每个数据的样式都一样，那么你就要为每个数据都添加一个样式。，在 `<col>` 元素中。`<col>` 元素被规定包含在 `<colgroup>` 容器中，而 `<colgroup>`就在 `<table>` 标签的下方。
```
<table>
  <colgroup>
    <col>
    <col style="background-color: yellow">
  </colgroup>
  <tr>
    <th>Data 1</th>
    <th>Data 2</th>
  </tr>
  <tr>
    <td>Calcutta</td>
    <td>Orange</td>
  </tr>
  <tr>
    <td>Robots</td>
    <td>Jazz</td>
  </tr>
</table>
```
##### 高级
###### `<caption>`标题
通过 `<caption>` 元素为你的表格增加一个标题，再把 `<caption>`元素放入 `<table>` 元素中。你应该把它放在 `<table>` 开始标签的下面。
```
<table>
  <caption>
    侏罗纪时期的恐龙
  </caption>

  …
</table>
```
###### `<thead>``<tbody>``<tfoot>`结构
-   `<thead>` 元素必须包住表格中作为表头的部分。一般是第一行，往往都是每列的标题，但是不是每种情况都是这样的。如果你使用了 [`<col>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/col)/[`<colgroup>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/colgroup) 元素，那么 `<thead>` 元素就需要放在它们的下面。
-   `<tfoot>` 元素需要包住表格中作为表脚的部分。一般是最后一行，往往是对前面所有行的总结，比如，你可以按照预想的方式将`<tfoot>`放在表格的底部，或者就放在 `<thead>` 的下面。(浏览器仍将它呈现在表格的底部)
-   `<tbody>` 元素需要包住表格内容中不在表头或表尾的其他部分。它可以出现在表头的下方，或者有时出现在表脚下方，这取决于你如何安排它。
###### 嵌套表格
在一个表格中嵌套另外一个表格是可能的，只要你包含完整的结构，包括 `<table>` 元素。这样通常是不建议的，因为这种做法会使标记看上去很难理解，对使用屏幕阅读的用户来说，无障碍性也降低了。以及在很多情况下，也许你只需要插入额外的单元格、行、列到已有的表格中。然而有时候是必要的，比如你想要从其他资源中更简单地导入内容。
```
<table id="table1">
  <tr>
    <th>标题1</th>
    <th>标题2</th>
    <th>标题3</th>
  </tr>
  <tr>
    <td id="nested">
      <table id="table2">
        <tr>
          <td>单元格1</td>
          <td>单元格2</td>
          <td>单元格3</td>
        </tr>
      </table>
    </td>
    <td>单元格2</td>
    <td>单元格3</td>
  </tr>
  <tr>
    <td>单元格4</td>
    <td>单元格5</td>
    <td>单元格6</td>
  </tr>
</table>
```
###### scope属性
scope属性，可以添加在 `<th>` 元素中，以告诉屏幕阅读器该表头的类型——它是所在行的表头，还是所在列的表头。
`scope` 还有两个可选的值： `colgroup` 和 `rowgroup`。这些用于位于多个列或行的顶部的标题。
如果要替代 `scope` 属性，可以使用 `id` 和 `headers` 属性来创建标题与单元格之间的联系。使用方法如下：
1.  为每个 `<th>` 元素添加一个唯一的 `id` 。
2.  为每个 `<td>` 元素添加一个 `headers` 属性。每个单元格的 `headers` 属性需要包含它从属于的所有标题的 id，之间用空格分隔开
```
<thead>
  <tr>
    <th id="purchase">Purchase</th>
    <th id="location">Location</th>
    <th id="date">Date</th>
    <th id="evaluation">Evaluation</th>
    <th id="cost">Cost (€)</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th id="haircut">Haircut</th>
    <td headers="location haircut">Hairdresser</td>
    <td headers="date haircut">12/09</td>
    <td headers="evaluation haircut">Great idea</td>
    <td headers="cost haircut">30</td>
  </tr>

  …
</tbody>
```
#### 表单
HTML 表单用于收集用户的输入信息。
HTML 表单表示文档中的一个区域，此区域包含交互控件，将用户收集到的信息发送到 Web 服务器。
表单元素是允许用户在表单中输入内容，比如：文本域（textarea）、下拉列表（select）、单选框（radio-buttons）、复选框（checkbox） 等等。
`<button>` 按钮  有一个属性type
我们可以使用 `<form>`标签来创建表单:
```
<form>
.
input 元素
.
</form>
```
`<form>`它是一个容器元素，但它也支持一些特定的属性来配置表单的行为方式。它的所有属性都是可选的，但实践中最好至少要设置 [`action`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form#attr-action) 属性和 [`method`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form#attr-method) 属性。
-   `action` 属性定义了在提交表单时，应该把所收集的数据送给谁（URL）去处理。
-   `method` 属性定义了发送数据的 HTTP 方法（通常是 `get` 或 `post`）。
#### 输入元素
多数情况下被用到的表单标签是输入标签`<input>`
输入类型是由 type 属性定义。
几种常用的输入类型:
* 文本（text）
* 密码（password）
* 单选框（radio）
* 复选框（checked）
* 隐藏域（hidden）
* 按钮（submit）
* 重置（reset）
* 文本域（textarea）
* 下拉框（select）
### 7.超链接
#### 什么是超链接？
超链接是互联网提供的最令人兴奋的创新之一，它们从一开始就一直是互联网的一个特性，使互联网成为_互联的网络_。超链接使我们能够将我们的文档链接到任何其他文档（或其他资源），也可以链接到文档的指定部分，我们可以在一个简单的网址上提供应用程序。几乎任何网络内容都可以转换为链接，点击（或激活）超链接将使网络浏览器转到另一个网址。
#### 解析链接
##### 结构
通过将文本或其他内容包裹在 `<a>`元素内，并给它一个包含网址的 `herf`属性（也称为**超文本引用**或**目标**，它将包含一个网址）来创建一个基本链接。
~~~
<p>
  我创建了一个指向 <a href="https://www.mozilla.org/zh-CN/">Mozilla 主页</a>的链接。
</p>

~~~
##### 块级链接
任何内容，甚至块级链接都可以作为链接出现。如果想让标题元素变为链接，就把它包裹在锚点元素（`<a>`）内，像这个代码段一样：
```
<a href="https://developer.mozilla.org/zh-CN/">
  <h1>MDN Web 文档</h1>
</a>
<p>自从 2005 年起，就开始记载包括 CSS、HTML、JavaScript 等网络技术。</p>
```
##### 图片链接
如果有需要作为链接的图片，使用 [`<a>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a) 元素来包裹要引用图片的 [`<img>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img) 元素。
```
<a href="https://developer.mozilla.org/zh-CN/">
  <img src="mdn_logo.svg" alt="MDN Web 文档主页" />
</a>
```
##### title属性
链接的另一个属性是 `title`。这旨在包含关于链接的补充信息，例如页面包含什么样的信息或需要注意的事情。
```
<p>
  我创建了一个指向<a href="https://www.mozilla.org/zh-CN/"
   title="了解 Mozilla 使命以及如何参与贡献的最佳站点。">Mozilla 主页</a>的超链接。
</p>
```
##### 文档片段
超链接除了可以链接到文档外，也可以链接到 HTML 文档的特定部分（被称为**文档片段**）。要做到这一点，你必须首先给要链接到的元素分配一个 [`id`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes#id) 属性。通常情况下，链接到一个特定的标题是有意义的，这看起来就像下面这样：
```
<h2 id="Mailing_address">邮寄地址</h2>
```
为了链接到那个特定的 `id`，要将它放在 URL 的末尾，并在前面包含井号（`#`），例如：
```
<p>
  要提供意见和建议，请将信件邮寄至<a href="contacts.html#Mailing_address">我们的地址</a>。
</p
```

### 8.文档和网站结构
#### 基本组成
   网页的外观多种多样，但是除了全屏视频或游戏，或艺术作品页面，或只是结构不当的页面以外，都倾向于使用类似的标准组件：
* 页眉`<header>`：通常横跨于整个页面顶部有一个大标题 和/或 一个标志。这是网站的主要一般信息，通常存在于所有网页。
* 导航栏`<nav>`：指向网站各个主要区段的超链接。通常用菜单按钮、链接或标签页表示。
* 主内容`<main>`：中心的大部分区域是当前网页大多数的独有内容，例如视频、文章、地图、新闻等。这些内容是网站的一部分，且会因页面而异。
* 侧边栏`<aside>`：一些外围信息、链接、引用、广告等。
* 页脚`<footer>`：横跨页面底部的狭长区域。和标题一样，页脚是放置公共信息（比如版权声明或联系方式）的，一般使用较小字体，且通常为次要内容。
#### 布局细节
-   [`<main>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/main) 存放每个页面独有的内容。每个页面上只能用一次 `<main>`，且直接位于 [`<body>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body) 中。最好不要把它嵌套进其他元素。
-   [`<article>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 包围的内容即一篇文章，与页面其他部分无关（比如一篇博文）。
-   [`<section>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section) 与 `<article>` 类似，但 `<section>` 更适用于组织页面使其按功能（比如迷你地图、一组文章标题和摘要）分块。一般的最佳用法是：以 [标题](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Howto/Set_up_a_proper_title_hierarchy) 作为开头；也可以把一篇 `<article>` 分成若干部分并分别置于不同的 `<section>` 中，也可以把一个区段 `<section>` 分成若干部分并分别置于不同的 `<article>` 中，取决于上下文。
-   [`<aside>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/aside) 包含一些间接信息（术语条目、作者简介、相关链接，等等）。
-   [`<header>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/header) 是简介形式的内容。如果它是 [`<body>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/body) 的子元素，那么就是网站的全局页眉。如果它是 [`<article>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/article) 或[`<section>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section) 的子元素，那么它是这些部分特有的页眉（此 `<header>` 非彼 [标题](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML#%e5%a2%9e%e5%8a%a0%e4%b8%80%e4%b8%aa%e6%a0%87%e9%a2%98)）。
-   [`<nav>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/nav) 包含页面主导航功能。其中不应包含二级链接等内容。
-   [`<footer>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/footer) 包含了页面的页脚部分。
