# 常见问题

### 1. electron环境下引用第三方js库（如: jQuery）时出现无法引用的通用解决办法

    在主页index.html中按照注释加入以下代码

    <!-- Insert this line above script imports  -->
    <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>

    <!-- normal script imports etc  -->
    <script src="scripts/jquery.min.js"></script>    
    <script src="scripts/vendor.js"></script>    

    <!-- Insert this line after script imports -->
    <script>if (window.module) module = window.module;</script>

    以上代码的作用包括：

    * Works for both browser and electron with the same code
    * Fixes issues for ALL 3rd-party libraries (not just jQuery) without having to specify each one
    * Script Build / Pack Friendly (i.e. Grunt / Gulp all scripts into vendor.js)
    * Does NOT require node-integration to be false

但对于使用bootstrap的用户来讲，由于内部也引用了jQuery, 因此在解决boostrap内部在electron环境下对jQuery的引用问题时，需要额外使用以下方式:
1. 使用npm命令安装jquery：`npm install jquery --save`
2. 采用 `通用第三方js引用解决方案`. 


[官网issue链接](https://github.com/electron/electron/issues/254#issuecomment-183483641)
