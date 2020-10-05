---
layout: default
---

I'm a **freelance data scientist & python developer** with a **PhD in machine learning** from the TU Berlin.
<br>
Have a look at my [CV](/assets/franziska_horn.pdf) and feel free to <a href="mailto:franzi@datasc.xyz?Subject=Freelance%20opportunity" target="_top">contact me</a> about freelance opportunities!

I'd love to support you in your data science projects, teach your team how to successfully apply machine learning algorithms, or help you recruit capable data scientists for permanent positions.


## consulting
Your data - may that be information about your customers, sensor measurements from the machines on your assembly line, images, or text documents - is like a rough diamond: treated with the right tools, it will be invaluable!

To successfully utilize this data to, for example, gain new insights about customer churn, monitor your machines with a predictive maintenance approach, or automate boring and error-prone processes, requires two things: a deep understanding of the problem and data at hand, as well as the intimate knowledge of a wide array of machine learning algorithms, ranging from basic data analysis tools to natural language processing, computer vision, and deep learning methods. Luckily, the first part is already taken care of, as you are an expert in your domain. And I am here to help you choose, apply, and evaluate the right machine learning models to transform your data into value.

I'm happy to support you at all stages of the data science workflow:
![](/assets/data_science_workflow.gif)
- define the scope of your problem and outline how machine learning and AI can help you solve it
- implement and evaluate algorithms to analyze your data and/or
- advise on and discuss potential solutions with the data scientists in your team
- support you in deploying a production-ready machine learning solution

I prefer to work in an agile manner with short iterations and in close collaboration with the data owners in your team to ensure that the machine learning solution fits all your needs and generalizes well even to potentially novel settings encountered in your day to day operations.


## data science workshops
To help you and your team better understand the potential and challenges of different machine learning methods, I offer a 4 day on-site or remote data science workshop, where you will learn the basics of machine learning, including various supervised and unsupervised learning algorithms, and get many practical tips. Besides the necessary theory, the workshop also includes a lot of practical examples in Python. In a hands-on case study on the last day, you can apply everything that you've learned to a real world problem.

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
    + spotting over- and underfitting to ensure your prediction model generalizes to new data
* practical exercises, including natural language processing and computer vision examples

In addition to this in-depth workshop targeted at (about-to-be) data scientists, I also offer a less technical 1.5 day introduction to machine learning for those in your firm that want to understand where & how data science can add value, but who will not be applying the algorithms themselves.


## recruiting
For a data science endeavor to be successful, a thorough understanding of the problem setting and data is at least as important as knowing the ins and outs of the different machine learning algorithms. Therefore, if you decide that your firm might benefit from some long-term data science expertise, I strongly suggest you build your own data science team. While external consultants may have a broader knowledge of the different tools and can advise you on which advanced algorithms are worth considering for your use case, they can never have the same deep understanding of your data as someone working at your firm.

But finding the right people is often tricky. Data scientist are in high demand right now, which means they can be picky when it comes to applying for jobs. Furthermore, a lot of people who simply took an online course on machine learning like to call themselves "data scientist" nowadays, while it takes a much deeper understanding and practical knowledge to provide a meaningful contribution to your team.

I can help you build your data science team by:
* writing compelling job postings, asking for meaningful qualifications instead of random buzzwords
* screening applicants with a personalized hiring challenge (like [this one](https://github.com/cod3licious/spectrm-challenge)), including programming and theoretical questions, tailored to your requirements
* conducting technical interviews


## personal projects & open source
I'm passionate about writing clean and efficient code and like to give back to the community via open source libraries.

#### PubVis
[PubVis](https://github.com/cod3licious/pubvis) is a WebApp meant to help scientists with their literature research. Instead of having to search for a specific topic, the landscape of published research can be explored visually and papers similar in content to an article of interest are just a click away.  A demo of the app is running [here](https://pubvis.herokuapp.com/) (with PubMed articles about different cancer types) and [here](https://arxvis.herokuapp.com/) (with arXiv articles about machine learning). Further details on the implementation can be found in the corresponding [paper](http://arxiv.org/abs/1706.08094).

#### Classify Me! Why?
To make machine learning algorithm decisions more transparent, we can use _Layer-wise Relevance Propagation_ (LRP) to visualize the features that influenced a classification decision. The [Classify Me! Why? WebApp](https://classifymewhy.herokuapp.com/) gives an interactive example of how this can look like for a text classification task. The code is based on scikit-learn and the nlputils and textcatvis libraries described below.

#### autofeat
[autofeat](https://github.com/cod3licious/autofeat) is a Python library with a linear regression and classification model that automatically engineers and then selects non-linear features that significantly improve the prediction performance of the model. This is especially helpful if you have small datasets and/or want to be able to interpret your model to see how each input feature influences the prediction of the target. Further information can be found in the [paper](https://arxiv.org/abs/1901.07329) or my [talk at the PyCon & PyData 2019 conference in Berlin](https://www.youtube.com/watch?v=4-4pKPv9lJ4).

#### nlputils
[nlputils](https://github.com/cod3licious/nlputils) is a Python library for analyzing text documents by transforming texts into TF-IDF features, using various similarity measures to compare documents, classify them with a k-nearest-neighbors classifier, and visualize them with t-SNE. Check out the [Jupyter notebook with examples](https://github.com/cod3licious/nlputils/blob/master/examples/examples.ipynb)!

#### textcatvis
[textcatvis](https://github.com/cod3licious/textcatvis) is a Python library with some tools for the exploratory analysis of text datasets. It can help you better understand a collection of texts by identifying the relevant words of the documents in some classes or clusters and visualizing them in word clouds. Some examples can be found in the corresponding paper ([short](http://arxiv.org/abs/1707.06100) or [long](http://arxiv.org/abs/1707.05261) version).

#### Similarity Encoder (SimEc) and Context Encoder (ConEc)
[SimEc](https://github.com/cod3licious/simec) is a neural network architecture for learning low dimensional representations of data points by projecting high dimensional input data into an embedding space where some given pairwise similarities between the data points are approximated linearly. For further details have a look at the corresponding [paper](http://www.czasopisma.pan.pl/Content/109871/PDF/07_821-830_00901_Bpast.No.66-6_31.12.18_K2.pdf?handler=pdf), my [PhD thesis](http://dx.doi.org/10.14279/depositonce-9956), or this [Jupyter notebook](https://github.com/cod3licious/simec/blob/master/basic_examples_compact.ipynb) with some examples.

[ConEc](https://github.com/cod3licious/conec) is a variant of SimEc for learning word embeddings. It is a simple but powerful extension of the continuous bag-of-words (CBOW) word2vec model trained with negative sampling and can be used to easily generate embeddings for out-of-vocabulary words and better representations for words with multiple meanings. Further details are described in the corresponding [paper](https://arxiv.org/abs/1706.02496).
