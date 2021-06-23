## Dynamic Question Feed
When I was in [my college](https://ndc.edu.bd/) I had a massive collection of interesting questions scattered 
in various random pages in my notebook.
Whenever I needed to revisit a problem I had to search each and every page of each and every notebook I ever had!

That's when I decided to actually go about solving that problem, but making it more challenging and fun!

### How it all started
I created a [http://irtiaz.github.io/Questions](webpage) where I hard-code questions in pure html like so
```html
<li>
	Some question
</li>
```
While it works, it was extremely tedious to create a new question or modify an existing one. Not to meention the image management for them!

*[Here's the source code if you are interested to learn the hard way](https://github.com/Irtiaz/Questions)*

### How it is now

That's when I decided to make this question-feed completely dynamic. By which I mean that the admin will not have to add each and every question by hard-coding it
Rather he will get an intuitive GUI where he can write the question with the solution, and the web app will be smart enough to code that question itself!
Also, the questions can be edited or deleted with a single mouse click!!

I used [Next JS](http://nextjs.org/) and [mongoDB](https://www.mongodb.com/) as the main tools for this website.

You can go ahead and visit the website (deployed with [Vercel](https://vercel.com/))
**Right now all the questions are in Bangla**

With that being said, I **do not** plan on making the questions editable by general people. You **will** need a password to edit or add questions
