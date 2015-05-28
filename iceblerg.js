// The MIT License (MIT)
//
// Copyright (c) 2015 Joshua Bemenderfer
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* Disable certain jsHint warnings */
// Allow inline ifs which return null
/* jshint -W030 */

var fse = require('fs-extra');
var extend = require('extend');
var path = require('path');

var modelGenerator = require('./scripts/model-generator');

var defaultOptions = {
    'post-dir': './posts',
    'template-dir': './templates',
    'output-dir': './out',
    'post-extensions': ['.md', '.markdown', '.txt'],
    'template-extension': '.jade',
    'preview-length': 70,
    'preview-separator': '==[END PREVIEW]==',
    /** Render function used for every file. Override this in the options to
     * implement your own template engines and markup renderers.
     * @param {string} templatePath - The full path to the template used.
     * @param {string} data - An object containing the iceblerg model as well as page-specific data.
     * @param {string} type - The page type, eg. postPage, tagPage, authorPage, overviewPage.
     * @returns {string} - The generated HTML string.
     */
    'render': function(templatePath, data, type) {
        try {
            // iceblerg.contentRenderer is used to render the body of a post to HTML
            data.iceblerg.contentRenderer = require('marked');
            
            // Render the template with Jade using the data supplied.
            return require('jade').renderFile(templatePath, data);
        } catch (e) {
            return e.message;
        }
    }
};

/**
 * Returns a new instance of iceblerg which can be used to generate a blog.
 * @param {object} userOptions - Options which can be set by the user. See !TODO!
 */
var iceblerg = function(userOptions) {
    this.options = defaultOptions;
    extend(true, this.options, userOptions);

    /**
     * Set the options of the iceblerg instance.
     * @param {object} newUserOptions - Options which can be set by the user. See !TODO!
     */
    this.setOptions = function(newUserOptions) {
        extend(true, this.options, newUserOptions);
    };
    
    this.buildModel = function(callback) {
        modelGenerator(this.options, function(model) {
            callback ? callback(model) : null;
        });
    };
    
    this.generate = function(model, callback) {
        // Build the post pages. (Using byDate is simpler than using Object.keys())
        for (var i = 0; i < model.byDate.length; i++) {
            var postData = model.posts[model.byDate[i].post];
            
            var outputPath = path.join(this.options['output-dir'], 'posts', postData.path+".html");
            
            // Write the rendered page.
            fse.outputFile(outputPath, this.generatePostPage(model, postData));
        }
        
        // Build the tag pages.
        /* jshint -W004 */
        for (var i = 0; i < Object.keys(model.tags).length; i++) {
            var tag = Object.keys(model.tags)[i];
            
            var outputPath = path.join(this.options['output-dir'], 'tags', tag+'.html');
            fse.outputFile(outputPath, this.generateTagPage(model, tag));
        }
        
        // Build the author pages.
        for (var i = 0; i < Object.keys(model.authors).length; i++) {
            var author = Object.keys(model.authors)[i];
            
            var outputPath = path.join(this.options['output-dir'], 'authors', author+'.html');
            fse.outputFile(outputPath, this.generateAuthorPage(model, author));
        }
        /* jshint +W004 */
        
        // Build the overview page.
        fse.outputFile(path.join(this.options['output-dir'], 'main', 'overview.html'),
            this.generateOverviewPage(model));
            
        console.log("[iceblerg] Sucessfully Generated Blog. Output: "+this.options['output-dir']);
    };
    
    this.generatePostPage = function(model, postData) {
        // Set the page data for the model. Modifying the model avoids extra extends
        // but is easier to create bugs if we forget to unset it afterwards.
        model.page = postData;
        return this.options.render(
            path.join(
                this.options['template-dir'],
                "post"+this.options['template-extension']
            ),
            {'iceblerg': model},
            'postPage'
        );
    };
    
    this.generateTagPage = function(model, tagName) {
        model.page = {
            tag: tagName,
        };
        return this.options.render(
            path.join(
                this.options['template-dir'],
                "tag"+this.options['template-extension']
            ),
            {'iceblerg': model},
            'tagPage'
        );
    };
    
    this.generateAuthorPage = function(model, authorName) {
        model.page = {
            author: authorName,
        };
        return this.options.render(
            path.join(
                this.options['template-dir'],
                "author"+this.options['template-extension']
            ),
            {'iceblerg': model},
            'authorPage'
        );
    };
    
    this.generateOverviewPage = function(model) {
        return this.options.render(
            path.join(
                this.options['template-dir'],
                "overview"+this.options['template-extension']
            ),
            {'iceblerg': model},
            'overviewPage'
        );
    };
};

module.exports = iceblerg;
