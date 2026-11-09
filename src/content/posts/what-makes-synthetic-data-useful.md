---
title: "What makes synthetic data useful?"
description: "A short guide to the energy-distribution view of visual pretraining, based on Shaping Useful Noise."
date: 2026-11-08
category: Research notes
tags: [Synthetic data, Representation learning]
# Unpublished placeholder: keep this note out of pages, search and sitemap.
draft: true
---
Synthetic images can look convincing without being a good training distribution. Conversely, images that look nothing like photographs can still teach a model useful visual structure. So what should we measure?

Our paper, **Shaping Useful Noise: Energy Distributions Predict Visual Pretraining Quality**, studies one part of that question: the likelihood levels occupied by a dataset under a real-image density model.

## A distribution, not a single score

A normalised density model assigns each image an energy, the negative log of its probability. High likelihood means low energy. Sparse, simple images and dense textures can occupy different parts of the energy range.

Averaging those scores throws away much of the structure. Selecting only the most likely images can also narrow the training distribution. Instead, we compare how often a dataset occupies each likelihood level.

## What ELD measures

Energy-Level Distribution Distance, or ELD, is the Wasserstein-1 distance between real and synthetic energy distributions. Its percentile variant compares synthetic real-energy ranks with a uniform reference, removing dependence on the absolute energy scale.

This reveals several kinds of mismatch: noise-like sources in low-likelihood regions; over-concentrated sources in narrow bands; and broad distributions that are still shifted away from the reference.

## What it does not measure

Two datasets can have similar energy profiles while containing different concepts. Energy matching alone does not guarantee semantic coverage or diversity. The density model is also part of the evaluation: changing it can change which image properties matter.

In the DINO/ViT-S experiments, lower ELD is associated with stronger transfer. That association is useful evidence, not a guarantee that every source with a lower score is better in every setting.

## From measurement to curation

The energy profile suggests where a synthetic pool is missing mass or placing too much of it. Resampling within energy bands, and mixing sources with complementary profiles, can move the training distribution toward the real reference while retaining diversity.

[Explore the interactive project page](../../papers/noiseAudits/) for schematic energy profiles and the reported experimental values, or [read the full paper](../../docs/noiseAudits.pdf).
