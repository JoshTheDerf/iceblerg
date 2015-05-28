![Iceblerg Logo](./assets/iceblerg-full.png)
---
*A no-frills static blog generator with an emphasis on easy integration.*

iceblerg is essentially a blog build system. You supply the content and the templates, and iceblerg spits out a completed blog.
It focuses on staying out of the way, providing the bare minimum featureset necessary.

iceblerg can easily be used in conjunction with a general build framework such as Gulp, and can supply its data to other systems as well. Unlike some other projects, you are not limited to the views supplied to you by iceblerg.

Please note that iceblerg is intended only for static sites. It does not and will not ever (well, maybe) have server components or features which require a running web server.
If you need something similar which does boast such capabilities, I encourage you to check out [Poet](https://jsantell.github.io/poet/).

###Contents:
> * [Getting Started](#getting-started)
> * [Features](#features)
> * [Post Format](#post-format)
> * [Options](#options)
> * [API Docs](#documentation)
> * [Examples](#examples)
> * [TODO](#todo)
> * [F.A.Q.](#faq)
> * [About](#about)
> * [Sites Using Iceblerg](#sites)
> * [License](#license)

### <a name="getting-started"></a> Getting Started
This guide assumes you already have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed, and have at a basic knowledge of their usage.


### <a name="features"></a> Features
 * File-based posts written in Markdown (default, switchable) and metadata specified with YAML.
 * Easy templating with Jade (default, switchable) with clearly defined conventions.
 * Entire blog model is supplied to every template along with page-specific variables, allowing for incredible flexibility.
 * Simple API and Configuration.
 * Support for multiple blergs per project.
 * Plenty of helper functions and methods.
 * Included Moment.js
 * < 500 LOC (currently)

### <a name="post-format"></a> Post Format
The beginning of the file should start with these YAML variables, surrounded by three dashes. (`---`) Additional optional variables may be found below.

```yaml
---
title: A Lesson in Generic Articles
author: John Doe
date: 2015-05-28
tags:
    - Tutorials
    - General  
---
```

Below, type the post content. The default parser is Markdown ([marked](https://github.com/chjj/marked).)

The `==[END PREVIEW]==` tag tells iceblerg to use the preceding text as the post preview. Other methods for specifying the preview may be found below.

```markdown
## Article I - Introduction
Good day my good ladies and gentlemen, allow me to introduce to you this concept which I shall now endeavor to make known to you in great depth.

==[END PREVIEW]==

For indeed, this lesson which you shall not soon forget is best
learned in Latin, the language of the sciences. Therefore, due to my desire to teach you to the best of my human ability, I shall be using that great language for the rest of this text.

## Article II - Lorem Ipsum
Ad et reprehenderit consequat Lorem veniam in exercitation. Dolor occaecat qui elit esse sit. Magna labore id deserunt laboris fugiat labore excepteur ut exercitation ea nulla enim dolor ut. Eu duis ullamco deserunt officia exercitation anim voluptate adipisicing ut duis nulla ad. Consectetur dolor sint commodo ex cupidatat non occaecat.
Veniam magna est exercitation est occaecat. Consectetur adipisicing voluptate exercitation pariatur est nostrud amet cupidatat nulla veniam duis minim. Sit Lorem non ipsum ullamco do laborum adipisicing proident quis. Officia nisi esse pariatur magna mollit cupidatat ad officia culpa do fugiat commodo.
```

The resulting post file should now look like this:
```markdown
---
title: A Lesson in Generic Articles
author: John Doe
date: 2015-05-28
tags:
    - Tutorials
    - General  
---
## Article I - Introduction
Good day my good ladies and gentlemen, allow me to introduce to you this concept which I shall now endeavor to make known to you in great depth.

==[END PREVIEW]==

For indeed, this lesson which you shall not soon forget is best
learned in Latin, the language of the sciences. Therefore, due to my desire to teach you to the best of my human ability, I shall be using that great language for the rest of this text.

## Article II - Lorem Ipsum
Ad et reprehenderit consequat Lorem veniam in exercitation. Dolor occaecat qui elit esse sit. Magna labore id deserunt laboris fugiat labore excepteur ut exercitation ea nulla enim dolor ut. Eu duis ullamco deserunt officia exercitation anim voluptate adipisicing ut duis nulla ad. Consectetur dolor sint commodo ex cupidatat non occaecat.
Veniam magna est exercitation est occaecat. Consectetur adipisicing voluptate exercitation pariatur est nostrud amet cupidatat nulla veniam duis minim. Sit Lorem non ipsum ullamco do laborum adipisicing proident quis. Officia nisi esse pariatur magna mollit cupidatat ad officia culpa do fugiat commodo.
```
#### Reserved Post Variables
\* = Recommended

| Variable | Values [Default]                | Definition
| -------- | ------------------------------- | ----------
| title    | String [File Name]              | The post title*
| author   | String ["Unknown"]              | The post author*
| date     | String (YYYY-MM-DD) [""]        | The post date*
| tags     | String[] [Empty Array]          | Post tags to group posts by topic.*
| preview  | String [first 70 chars of post] | Sets the post's preview text, allowing for unrelated text as the preview.
| preview-length | Integer [70]              | Amount of preview text to pull out of the post. Only valid if `preview` is not set and there is no `==[END PREVIEW]==` tag in the post body.

Custom variables may be added as well and used in templates.

### <a name="options"></a> Options
| Variable           | Values [Default]                   | Definition
| ------------------ | ---------------------------------- | ----------
| post-dir           | String ["./posts"]                 | The directory to search recursively for posts in.
| template-dir       | String ["./templates"]             | The directory to search for templates in.
| output-dir         | String ["./out"]                   | The directory to generate the blog in.
| post-extensions    | String[] ['.md', '.markdown', .txt]| Allowed extensions for posts. Other files in the posts directory will be ignored.
| template-extension | String [".jade"]                   | Templates with this extension in the templates directory will be used.
| preview-length     | Integer [70]                       | The default length for post previews. Only used if the post does not have the properties `preview`, `preview-length`, and does not contain an `==[END PREVIEW]==` tag.
| preview-separator  | String ["==[END PREVIEW]=="]       | The string which separates the preview from the rest of the post body.
| render             | Function [Custom Render Function TODO: Link.]  | The function which converts a template and the model data into a page. Can easily be changed.

### <a name="documentation"></a> Documentation
See the Wiki

### <a name="examples"></a> Examples
TODO: Fill in

### <a name="todo"></a> TODO
 * Fill in examples.
 * Add support for post-specific templates.
 * Add support for configurable individual template paths.
 * Add support for configurable individual output paths.
 * Make URL handling more robust.
 * Add support for post subdirectories. Right now the directory name is prepended to the post name and the directory structure flattened.
 * Finish documenting code.
 * Add tests.

### <a name="faq"></a> F.A.Q.
Q: **How do I change the template language?**

A: *See the documentation on adding a custom renderer* TODO: Link.

---
Q: **Can I run this on an express/connect/apache/nginx/etc. server?**

A: *No, but you can generate the output and upload it to be served statically.*

---
Q: **Can I use this with [INSERT BUILD SYSTEM HERE]**

A: *Most likely, but you might have to be a bit creative. I'm (probably) not going to add specific support for anything, but it should work well with Gulp at least. Just wrap your gulp.src call inside of the `buildModel` function.*

---
Q: **Why is there no command-line wrapper?**

A: *Because, simply, you'd probably write a shell script to automate the build process anyway. Since we're already using Node.js, why add more complexity? If you want to write a cli interface feel free. :)*

---
Q: **Why is the code so terrible and ugly?**

A: *I wrote this in an afternoon, I needed a blog framework for my site. Besides, beauty is in the eye of the beholder....*
```
<_<
>_>
```

---
Q: **Why Iceblerg? What do icebergs have to do with blog frameworks?**

A: *[INSERT DEEP AND WELL THOUGHT OUT, BUT KIND OF GENERIC RESPONSE ABOUT THE TIP OF THE ICEBERG HERE]*

---
Q: **Why "Blerg?"**

A: *No idea.*

### <a name="about"></a> About
iceblerg is written and maintained by [@Tribex](https://github.com/Tribex).

No penguins or polar bears were harmed in the making of this project. However, I do feel great remorse and regret for what happened to the leopard seals.

Fun fact, it took longer to write the documentation for iceblerg than it did to write the project itself. `-_-`

### <a name="sites"></a> Sites Using Iceblerg
Feel free to open an issue or submit a pull request to get your site added here!

 * [Missing Semicolon](http://tribex.github.io) - Tribex's personal site and blog about various programming disasters.

### <a name="license"></a> License
```
The MIT License (MIT)

Copyright (c) 2015 Joshua Bemenderfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
