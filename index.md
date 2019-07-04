---
layout: default
---

I'm a **freelance data scientist & python developer**, currently finishing my **PhD in machine learning** at the TU Berlin in Klaus-Robert Müller's lab.
<br>
Have a look at my [CV]({{ site.url }}/assets/franziska_horn.pdf) and feel free to <a href="mailto:franzi@datasc.xyz?Subject=Freelance%20opportunity" target="_top">contact me</a> about freelance opportunities!


## consulting
Machine learning specialists often possess a certain arrogance, believing that the intimate knowledge of complex algorithms automatically enables them to successfully work with any kind of data. In practice, however, real insights can only be generated with a deep understanding of the data at hand, as otherwise the results obtained by some fancy method may not generalize to the novel settings encountered in day to day operations. Therefore, for me it is very important to closely work together with the data owners in your team when developing a data science solution tailored to your needs.

I'm happy to support you at all stages of the data science workflow:
![]({{ site.url }}/assets/data_science_workflow.gif)
- defining the scope of your problem and deciding whether machine learning and AI are useful tools in your case (I know, right now everyone wants some AI powered product, but sometimes traditional approaches are just as good while being faster to implement!)
- advising on and discussing potential solutions with the data scientists in your team
- analyzing your data and implementing algorithms in close collaboration with the data owners in your team
- supporting your team in deploying a production-ready machine learning solution


## recruiting
A thorough understanding of the data is often more important than knowing the ins and outs of every single machine learning algorithm. Therefore, if you decide that your firm might benefit from some data science expertise, I strongly suggest you build your own data science team. While external consultants may be able to help you when it comes to deciding which advanced algorithms might be worth considering for your use case, they can never have the same deep understanding of your data and problem setting as someone working at your firm.

But finding the right people can of course be tricky. Data scientist are in high demand right now, which means they can be picky when it comes to applying to jobs. Furthermore, a lot of people who simply took some online course on machine learning like to call themselves "data scientist" nowadays, while it takes a much deeper understanding and practical knowledge to provide a meaningful contribution to your team.

I can help you build your data science team by:
* writing compelling job postings, asking for meaningful qualifications instead of random buzzwords
* screening applicants with a personalized hiring challenge, including programming and theoretical questions, tailored to your requirements
* conducting technical interviews


## data science workshops
To help your team to better understand the challenges and potential of machine learning methods, I offer a 3 day on-site data science workshop, where you will learn the basics of machine learning, including various supervised and unsupervised learning algorithms, and get many practical tips. Besides the necessary theory, the workshop also includes a lot of practical examples in Python. In a hands-on case study on the third day, you can apply everything that you've learned to a real world problem.

The workshop covers:
* introduction to machine learning (ML) and its application areas
* introduction to Python data science libraries (e.g. numpy, pandas, sklearn, keras)
* exploratory data analysis & interactive visualizations
* unsupervised learning algorithms for
    + dimensionality reduction
    + outlier/anomaly detection
    + clustering
* supervised learning theory:
    + linear and non-linear classification & regression models like decision trees, kernel methods, ensemble models, and neural networks
    + evaluation and model selection techniques like cross-validation
    + dealing with over- and underfitting
* practical exercises, including natural language processing and computer vision examples


## open source projects
I'm passionate about writing clean and efficient code and like to give back to the community via open source libraries.

#### PubVis
[PubVis](https://github.com/cod3licious/pubvis) is a WebApp meant to help scientists with their literature research. Instead of having to search for a specific topic, the landscape of published research can be explored visually and papers similar in content to an article of interest are just a click away.  A demo of the app is running [here](https://pubvis.herokuapp.com/) (with PubMed articles about different cancer types) and [here](https://arxvis.herokuapp.com/) (with arXiv articles about machine learning). Further details on the implementation can be found in the corresponding [paper](http://arxiv.org/abs/1706.08094).

#### Classify Me! Why?
To make machine learning algorithm decisions more transparent, we can use _Layer-wise Relevance Propagation_ (LRP) to visualize the features that influenced a classification decision. The [Classify Me! Why? WebApp](https://classifymewhy.herokuapp.com/) gives an interactive example of how this can look like for a text classification task. The code is based on scikit-learn and the nlputils and textcatvis libraries described below.

#### autofeat
[autofeat](https://github.com/cod3licious/autofeat) is a Python library containing a linear regression model that automatically engineers many non-linear features and then selects a few of them to significantly improve the prediction performance. This is especially helpful if you have small datasets and/or want to be able to interpret your model to see how each input feature influences the prediction of the target. Further information can be found in the [paper](https://arxiv.org/abs/1901.07329).

#### nlputils
[nlputils](https://github.com/cod3licious/nlputils) is a Python library for analyzing text documents by transforming texts into tf-idf features, using various similarity measures to compare documents, classify them with a k-nearest-neighbors classifier, and visualize them with t-SNE. Check out the [iPython notebook with examples](https://github.com/cod3licious/nlputils/blob/master/examples/examples.ipynb)!

#### textcatvis
[textcatvis](https://github.com/cod3licious/textcatvis) is a Python library with some tools for the exploratory analysis of text datasets. It can help you better understand a collection of texts by identifying the relevant words of the documents in some classes or clusters and visualizing them in word clouds. Some examples can be found in the corresponding paper ([short](http://arxiv.org/abs/1707.06100) and [long](http://arxiv.org/abs/1707.05261)).

#### Similarity Encoders (SimEc) and Context Encoders (ConEc)
[SimEc](https://github.com/cod3licious/simec) is a neural network framework for learning low dimensional representations of data points by projecting high dimensional input data into an embedding space where some given pairwise similarities between the data points are approximated linearly. For further details and examples have a look at the corresponding [paper](http://www.czasopisma.pan.pl/Content/109871/PDF/07_821-830_00901_Bpast.No.66-6_31.12.18_K2.pdf?handler=pdf) or [iPython notebook](https://github.com/cod3licious/simec/blob/master/basic_examples_compact.ipynb).

[ConEc](https://github.com/cod3licious/conec) is a variant of SimEc for learning word embeddings. It is a simple but powerful extension of the continuous bag-of-words word2vec model trained with negative sampling and can be used to easily generate embeddings for out-of-vocabulary words and better representations for words with multiple meanings. Further details are described in the corresponding [paper](https://arxiv.org/abs/1706.02496).
