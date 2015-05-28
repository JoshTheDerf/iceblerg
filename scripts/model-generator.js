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

/**
 * @file Generates a structural model of the posts, tags, and authors for use in
 * parsing and rendering.
 */
 
/* Disable certain jsHint warnings */
// Allow inline ifs which return null
/* jshint -W030 */
 
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var moment = require('moment');
var nodeDir = require('node-dir');
var frontMatter = require('front-matter');

var modelGenerator = function(options, callback) {
    var model = {
        posts: {},
        tags: {},
        authors: {},
        byDate: [],
        
        // Utility Functions (In the model for access by the templates. TODO: Refactor)
        sanitizeURL: function(url) {
            return encodeURI(url);
        },
        
        // Always returns the base directory
        formatURL: function(baseDir, file, extension) {
            return this.sanitizeURL(path.join(baseDir, file+extension));
        },
        
        getAuthorURL: function(author) {
            return this.formatURL("../authors", author, ".html");
        },

        getTagURL: function(tag) {
            return this.formatURL("../tags", tag, ".html");
        },
        
        getPostURL: function(post) {
            if(typeof post == "object") {
                return this.formatURL("../posts", post.path, ".html");
            } else {
                return this.formatURL("../posts", post, ".html");
            }
        },
        
        getOverviewURL: function() {
            return this.formatURL("../main", "overview", ".html");
        },
        
        formatPostDate: function(post, format) {
            return moment(post.date, "YYYY MM DD").format(format);
        },
        
        sortNewestOldest: function(a, b) {
            var momentA = moment(a.date, "YYYY MM DD");
            var momentB = moment(b.date, "YYYY MM DD");
            if(momentA.isValid() && momentB.isValid()) {
                return momentB.valueOf() - momentA.valueOf();
            } else {
                return 0;
            }
        },
        
        sortOldestNewest: function(a, b) {
            var momentA = moment(a.date, "YYYY MM DD");
            var momentB = moment(b.date, "YYYY MM DD");
            if(momentA.isValid() && momentB.isValid()) {
                return momentA.valueOf() - momentB.valueOf();
            } else {
                return 0;
            }
        },
        
        getPostsByAuthor: function(author) {
            if (this.authors[author] === null || this.authors[author].length === 0)
                return null;
            
            var matchingPosts = [];
            
            for (var i = 0; i < this.authors[author].length; i++) {
                matchingPosts.push(this.posts[this.authors[author][i]]);
            }
            
            return matchingPosts.sort(this.sortNewestOldest);
        },
        
        getPostsByTag: function(tag) {
            if (this.tags[tag] === null || this.tags[tag].length === 0)
                return null;
            
            var matchingPosts = [];
            
            for (var i = 0; i < this.tags[tag].length; i++) {
                matchingPosts.push(this.posts[this.tags[tag][i]]);
            }
            
            return matchingPosts.sort(this.sortNewestOldest);
        },
        
        getAllAuthors: function() {
            return Object.keys(this.authors);
        },
        
        getAllTags: function() {
            return Object.keys(this.tags);
        },
        
        getAllPosts: function() {
            var postArray = [];
            for (var post in this.posts) {
                if(this.posts.hasOwnProperty(post))
                    postArray.push(this.posts[post]);
            }
            return postArray;
        },
        
        utils: {
            "moment": moment,
        }
    };
    
    // Get list of posts
    getDirectoryContents(
        options['post-dir'],
        options['post-extensions'],
        // Populate the model.
        function(paths) {
            // Load data for all posts, authors, and tags.
            for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
                // Sanitize and re-build the post path for usage. TODO: This is incredibly fragile and ugly. Needs a redo.
                var sanitizedPath = paths[pathIndex]
                    .split("posts"+path.sep)[1]
                    .split(path.sep).join("-")
                    .split(path.extname(paths[pathIndex]))[0];

                var postData = loadPostData(paths[pathIndex], options);
                postData.path = sanitizedPath;
                model.posts[sanitizedPath] = postData;
                
                // Add this post to the list of posts by this author, creating it if it doesn't exist.
                if (!model.authors[postData.author]) model.authors[postData.author] = [];
                model.authors[postData.author].push(sanitizedPath);
                
                // Add this post to the list of posts with this tag, creating it if it doesn't exist.
                for (var tagIndex = 0; tagIndex < postData.tags.length; tagIndex++) {
                    if (!model.tags[postData.tags[tagIndex]])
                        model.tags[postData.tags[tagIndex]] = [];
                    model.tags[postData.tags[tagIndex]].push(sanitizedPath);
                }
            }
            
            // Sort posts by date.
            // Build a temporary array to keep track of keys and dates.
            var dateArray = [];
            for (var keyIndex = 0; keyIndex < Object.keys(model.posts).length; keyIndex++) {
                var key = Object.keys(model.posts)[keyIndex];
                dateArray.push({'post': key, 'date': model.posts[key].date});
            }
            
            // Sort the temporary array by date.
            dateArray.sort(model.sortNewestOldest);
            
            model.byDate = dateArray;
            
            console.log("[iceblerg] Sucessfully Built Model");
            callback(model);
        }
    );
};

var loadPostData = function(postPath, options) {
    var post = {
        'title': path.basename(postPath, path.extname(postPath)),
        'author': 'Unknown',
        'date': '',
        'tags': [],
        'preview': null,
        'preview-length': 70,
        'body': '',
    };
    // TODO: Allow encodings other than UTF-8
    var rawPost = fs.readFileSync(postPath, {
        encoding: 'utf-8'
    });
    
    try {
        var parsedPost = frontMatter(rawPost);
        var attrs = parsedPost.attributes;
        post.body = parsedPost.body;
    
        extend(true, post, attrs);
    
        // If the post doesn't have a specified preview already.
        if (!post.preview) {
            // Check for an end preview tag, use the preceeding text as the preview if so.
            var splitBody = post.body.split(options['preview-separator']);
            if (splitBody.length > 1) {
                post.preview = splitBody[0];
                post.body = splitBody.join("");
            // See if the post has a preview-length attribute set. If so, use that many characters
            // of the body as the preview.
            } else if (post['preview-length']) {
                post.preview = post.body.substr(0, post['preview-length']);
            // Otherwise use the global preview length.
            } else {
                post.preview = post.body.substr(0, options['preview-length']);
            }
        }
        
    } catch (e) {
        //TODO: Proper logger
        console.log("[iceblerg] Error parsing post "+postPath+":\n"+e.message);
    }
    
    return post;
};

var getDirectoryContents = function(directory, extensions, callback) {
    nodeDir.files(directory, function(err, pathNames) {
        if(err) return;
        
        // Filter out files which do not have an allowed type.
        pathNames.filter(function(pathName) {
          return extensions.indexOf(path.extname(pathName).toLowerCase()) > -1;
        });
        
        callback ? callback(pathNames) : null;
    });
};

module.exports = modelGenerator;
