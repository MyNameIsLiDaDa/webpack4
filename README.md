# 关于webpack 4 的正确玩法

# 安装

需要 npm 以及 node 的支持;

# 基本安装

首先 `npm init -y ` 进行快速初始化一个package.json 文件

然后安装 `npm install webpack webpack-cli --save-dev `

安装完毕后 可以在 命令提示符输入  ./node_modules/.bin/webpack -v 查看版本;

可以输入 code . 打开 vscode;

# entry and output 基本用法

### 单个入口文件时

在根目录创建 webpack.config.js 文件

'use strict';  // 严格模式js

const path = require('path');  // 引入node 模块

module.exports = {

​    entry: './src/index.js',     // 入口 entry: path.join(__dirname, './src/index.js') // 这样写没有问题的;

​    output: {   // 输出

​        path: path.join(__dirname, 'dist'),

​        filename: 'bundle.js',

​    },

​    mode: 'production'

}




### 多个入口文件时

'use strict';

const path = require('path');

module.exports = {

​    entry: {

​        index: './src/index.js',    // 多个

​        search: './src/search.js' // 多个

​    },

​    output: {

​        path: path.join(__dirname, 'dist'),

​        filename: '[name].js',  // [name]是个占位符;

​    },

​    mode: 'production'

}

# mode

development

production

# loader的基本用法

首先, webpack 是一个打包工具基于node.js的也是基于v8引擎的, 所以可以理解成webpack只认识js语法以及node语法, 其他的都不认识

这个时候我们就需要loader了,他主要是给像 jsx, css, sass, less....等语法转化成webpack可以读懂的语法, 

可以说是个中间件 (翻译官);



'use strict';

const path = require('path');

const config = {

​    entry: {

​        index: './src/index.js',

​    },

​    output: {

​        path: path.join(__dirname, 'dist'),

​        filename: 'out.js',

​    },

​    module: {

​        rules: [   // 注意这里是有s的

​            { test: /\.txt$/, use: 'raw-loader' } // test : 匹配规则  ,   use: 指定的loader的名称;

​        ]

​    },

​    mode: 'production'

};

module.exports = config;

#plugins 基本用法

这里用 ' html-webpack-plugin' 举例子;

首先` npm install html-webpack-plugin -D (-D 就是 --save -dev)` 

html-webpack-plugin是个构造函数;



'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入html-webpack-plugin

const htmlPlugs = new HtmlWebpackPlugin({ 

​    template: path.join(__dirname, './src/index.html'), 

​    filename: 'index.html'

})

const config = {

​    entry: {

​        index: './src/index.js',

​    },

​    output: {

​        path: path.join(__dirname, 'dist'),

​        filename: 'out.js',

​    },

​    module: {

​        rules: [

​            { test: /\.txt$/, use: 'raw-loader' }

​        ]

​    },

​    plugins: [ 

​        htmlPlugs

​    ],

​    mode: 'production'

};

module.exports = config;

#ES6语法解析以及React基本配置
首先我们的webpack 并不能很好的解析一些es6的新特性,所有需要配置babel将其退化至es5;
安装: `npm install @babel/core @babel/preset-env babel-loader -D`

我们需要在根目录创建 .babelrc文件.
这里配置的是 @babel/preset-env
	{
	  "presets": [
	  	"@babel/preset-env"
	   ]
	}
还需要在webpack.config.js 中配置一下babel-loader


    'use strict';

    const path = require('path');

    const HtmlWebpackPlugin = require('html-webpack-plugin')

    const htmlPlugs = new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html'
    })
    
    const config = {
    
      entry: {
          index: './src/index.js',
      },
      output: {
          path: path.join(__dirname, 'dist'),
          filename: 'out.js',
      },
      module: {
          rules: [
              { test: /\.txt$/, use: 'raw-loader' },
              
              { test: /\.js$/, use: 'babel-loader'} // 配置这个, 就可以兼容es6的语法了;
          ]
      },
      plugins: [
          htmlPlugs
      ],
      mode: 'production'
    };
    
    module.exports = config;

以上就是es6的配置,下面的就是react的配置了;
首先我们需要安装react对应的npm包以及babel文件;
`npm install react react-dom @babel/preset-react -D`
安装完毕后我们首先需要配置一下.babelrc文件
    {
     "persets": [
      	"@babel/perset-env",
      	"@babel/perset-react"
      ] 
    }
然后可以写一段react的代码测试一下

    import React from 'react'
    import ReactDom from 'react-dom'
    
    class Search extends React.Component {
      render() {
          return <h1>React</h1>
      }
    }  
    
    ReactDom.render(
        <Search />,
        document.getElementById('root')
    )
#style以及css解析

webpack 是基于node.js的所有并不能直接解析style样式, 也并不认识.css的文件;所以我们需要安装相关的babel以及loader文件来解析;

安装`npm install style-loader css-loader -D`

安装后需要先配置webpack.config.js中的

    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.js$/, use: 'babel-loader'},
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    'css-loader'
                ]
            }
        ]
    },
这个style必须在css的前面, 有依赖关系的;

然后就可以需要的创建.css文件并将其引入项目中了;

# 图片以及文字解析

webpack还有一个重要的模块就是图片解析了.我们来看看怎么解决这个问题.

`npm install file-loader -D` 安装这个loader(注意这个是loader, 所以必须去webpack.config.js中进行配置  @babel的才需要去.babelrc中配置(根据情况);)

`npm install url-loader -D`

首先这两个loader都可以实现 字体以及图片的解析, (在vue2.x的webpack脚手架用是url的)

其实一定要比较的话 file的比url的轻量一些,url 会把图片转化成besa64 也就是说小于10k大小的图片, 会超过10k;

`{ test: /\.(png|jpg|gif|svg|JPG)$/, use: 'file-loader'},`

	{
		test: /\.(png|jpg|gif|svg|JPG)$/,
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 10240
				}
			}
		]
	}	
文字的`{ test: /\.(woff|woff2|eot|ttf)$/, use: 'file-loader'},`

其实用上面那个都可以实现解析的效果;

`思考一下什么是base64????`

 # watch

因为用的不多, 这里简单赘述, 在package.json中的scripts +"watch": "webpack --watch",就可以使用npm run watch使用它了;

# webpack-dev-server热更新

首先如果出现以下报错, 别听网上的删除node_modules, 先安装一下 npm install webpack-dev-server -D

`'webpack-dev-server' 不是内部或外部命令，也不是可运行的程序`

安装后检查package.json中是否安装成功, 然后别退出继续在scripts中加入, "dev": "webpack-dev-server --open"

随后在webpack.config.js中加上

	const webpack = require('webpack')
	module.exports = {
	  ...,
	  plugins: [
	  	html-webpack-plugin,
	    new webpacl.HotModuleReplacementPlugin()
	  ],
	  devServer: {
	    contentBase: path.join(__dirname, './dist'),
	    hot: true
	  }
	}
配置完毕, 如果之前有配置html-webpack-plugin, 这里可以直接在网页浏览index.html页面了;

![webpack-dev-server热更新原理](C:\Users\87314\Desktop\222\webpack-dev-server热更新原理.png)
#文件指纹
文件指纹通常用做版本管理, 比如代码上线的时候,如果只改了css的内容就没有必要同js一起更新. 在config中配置后会在dist的目录中给生成的index.js and index.css加上指纹,index_11co212.js, 也可以当做版本控制用;
![文件指纹](C:\Users\87314\Desktop\222\文件指纹.png)

    output: { // 在webpack.prod.js中配置, 文件指纹, []中的都是占位符, 6就是6个字符
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:6].js',
    },


    use: [  // 在文字和图片已经视频文件的loader配置;
    	{
    		loader: 'file-loader',
    		options: {
    			name: '[name]_[hash:6].[ext]'
    		}
    	}
    ]

下面是css的配置方法, 比较麻烦, 这里要说的是, 这里用lass的loader做例子,我们需要先安装一个plugin才能提取出css来;

一开始.css文件是不能提取出来的, `npm install mini-css-extract-plugin - D` 安装配置后就可以提出来了, 不过需要改个loader, css的loader改发和less很像, 只要把下面的less-loader去除即可;

    const miniCss = new MiniCssExtractPlugin ({
    	filename: '[name]_[contenthash:8].css'
    })
    // ------- less loader ---------
    { 
    	test: /\.less$/,
        	use: [
            	MiniCssExtractPlugin.loader,
                   'css-loader',
                   'less-loader'
             ] 
    },


#注意

--- 这里有个很重要的地方要说一下, 现在我们的项目可以说基本功能都搭建完毕了, 大概webpack的逻辑也搞清楚了;
现在需要做的是讲mode模块中的development和production 分出来,做成单独的.js文件;

分别是 webpack.dev.js  and  webpack.prod.js; 

这里面第一个放的是编写代码阶段的代码, 比如热更新等;

第二个是代码上线打包的逻辑;

还需要在package.json中配置;

    "build": "webpack --config webpack.prod.js",
    "dev": "webpack-dev-server --config webpack.dev.js --open",

此时很多代码重复, 可以参考vue2.x的-cli 理解整合;

# 关于打包后的压缩问题

首先js代码可以不用管他, 因为webpack4里面内置了uglifyjs-webpack-plugin在打包时候自动给js做了压缩;

css压缩呢! 我们需要安装个plugin

 `npm install optimize-css-assets-webpack-plugin -D `

` npm i cssnano -D`

    const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
    const cssPlugin = new OptimizeCSSAssetsWebpackPlugin({
    	assetNameRegExp: /\.css$/g, // 容易写错;
    	cssProcessor: require('cssnano')
    })
记得挂着到module.exports 中的plugins中;css到此为止;

其实html代码压缩,只要使用了html-webpack-plugin就可以实现了;

`npm install html-webpack-plugin -D`

    const htmlPlugs = new HtmlWebpackPlugin ({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index_[contenthash:8].html',
      chunks: ['index'], // 配置chunks
      inject: true, // 打包后是否将css注入html中;
      minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
      }
    })
# 关于自动清除dist目录下的文件

每次打包完后, 如果dist下面有文件就会老文件和新文件混在一起,`clean-webpack-plugin`

这个插件可以很好的解决这个问题, ` npm install clean-webpack-plugin -D`

只需要在plugins挂载即可,  这里有个坑要踩一下, 引入的时候这样写:

`const { CleanWebpackPlugin } = require('clean-webpack-plugin')`

