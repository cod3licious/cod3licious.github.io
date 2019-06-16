---
layout: default
---

I'm a **freelance data scientist & python developer**, currently finishing my **PhD in machine learning** at the TU Berlin in Klaus-Robert Müller's lab.
<br>
Have a look at my [CV]({{ site.url }}/assets/franziska_horn.pdf) and feel free to <a href="mailto:franzi@datasc.xyz?Subject=Freelance%20opportunity" target="_top">contact me</a> about freelance opportunities!


## consulting
something about consulting stuff i do

## data science workshops

![]({{ site.url }}/assets/data_science_workflow.gif)
something about data science workshops


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
