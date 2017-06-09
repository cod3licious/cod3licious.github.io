---
layout: default
---

I'm a data scientist & python developer and I'm currently working on my PhD in machine learning at the TU Berlin. Have a look at my [CV]({{ site.url }}/assets/franziska_horn.pdf) and feel free to contact me about freelance projects!

## projects & code

#### PubVis
[PubVis](https://pubvis.herokuapp.com/) is a WebApp meant to help scientists with their literature research. Instead of having to search for a specific topic, the landscape of published research can be explored visually and papers similar in content to an article of interest are just a click away.

#### nlputils
[nlputils](https://github.com/cod3licious/nlputils) is a Python library for analyzing text documents by transforming texts into tf-idf features, using various similarity measures to compare documents, classify them with a k-nearest-neighbors classifier, and visualize them with t-SNE. Check out the [iPython notebook with examples](https://github.com/cod3licious/nlputils/blob/master/examples/examples.ipynb)!

#### textcatvis
[textcatvis](https://github.com/cod3licious/textcatvis) is a Python library with some tools for the exploratory analysis of text datasets. It can help you better understand a collection of texts by identifying the relevant words of the documents in some classes or clusters and visualizing them in word clouds. Some examples can be found in the corresponding paper.

#### Similarity Encoders (SimEc) and Context Encoders (ConEc)
[SimEc](https://github.com/cod3licious/simec) is a neural network framework for learning low dimensional representations of data points by projecting high dimensional input data into an embedding space where some given pairwise similarities between the data points are approximated linearly. For further details and examples see the corresponding [paper](http://arxiv.org/abs/1702.01824) or [iPython notebook](https://github.com/cod3licious/simec/blob/master/examples_simec.ipynb)

[ConEc](https://github.com/cod3licious/conec) is a variant of SimEc for learning word embeddings. It is a simple but powerful extension of the continuous bag-of-words word2vec model trained with negative sampling and can be used to easily generate embeddings for out-of-vocabulary words and better representations for words with multiple meanings. Further details are described in the corresponding [paper](https://arxiv.org/abs/1706.02496).
