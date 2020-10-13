# -*- coding: utf-8 -*-

# Need this to prevent 'no display name and no $DISPLAY environment variable' error by _tkinter
import matplotlib
matplotlib.use('Agg')

import sys
import json
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import FixedLocator, FixedFormatter
import matplotlib as mpl

# vals = "1_0_1_-1_-1_-1_1"
vals = sys.argv[1]
tmp = vals.split("_")
stats = list(map(float, tmp))

plt.rcParams["font.family"] = 'NanumGothic'
plt.rcParams['font.size'] = 11.

label = ["6일전", "5일전", "4일전", "3일전", "2일전", "1일전", "오늘"]

fig = plt.figure(figsize=(8.3, 4))
ax = plt.gca()
plt.plot(label, stats, marker='o', ms=10, color="darkblue", alpha=0.8)
ax.set_facecolor('#FAFAFA')
ax.set_title(u"당신의 최근 일주일 기분 변화는?", color='black', y=1.05, weight=600, size=15)
ax.set_ylim(-1.8,1.8)

plt.yticks(fontsize=14, weight=500)
plt.xticks(fontsize=13, weight=500)

y_formatter = FixedFormatter([u"좋음", u"보통", u"나쁨"])
y_locator = FixedLocator([1, 0, -1])
ax.tick_params(bottom=True, top=False, left=False, right=False)
ax.yaxis.set_major_formatter(y_formatter)
ax.yaxis.set_major_locator(y_locator)
plt.savefig("/home/ec2-user/HOWRU/public/images/chart_dailyPerWeek/dailyPerWeek_"+vals+".png", bbox_inches='tight', pad_inches=0.3)
