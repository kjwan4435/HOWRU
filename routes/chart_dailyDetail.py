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

# vals = "2.1_3.3_4_4_5.2"
vals = sys.argv[1]
tmp = vals.split("_")
stats = [float(i) for i in tmp] # list(map(float, tmp))
stats = np.array(stats)

plt.rcParams["font.family"] = 'NanumGothic'
plt.rcParams['font.size'] = 11.

labels = np.array([u'수면 문제', u'식사 문제', u'감정 문제', u'대인 관계', u'운동 부족'])
# labels = np.array(['Sleep Problem', 'Eat Problem', 'Mood Problem', 'Social', 'Activity'])
angles = np.linspace(0, 2*np.pi, len(labels), endpoint=False)

labels = np.concatenate((labels, [labels[0]]))
stats = np.concatenate((stats, [stats[0]]))  # Closed
angles = np.concatenate((angles, [angles[0]]))  # Closed

fig = plt.figure(figsize=(4, 4))
figsize = (10, 10)
ax = fig.add_subplot(111, polar=True)
# Change the color of the tick labels.
ax.tick_params(colors='#111111')
# Make the y-axis (0-100) labels smaller.
ax.tick_params(axis='y', labelsize=0)
# Change the color of the circular gridlines.
ax.grid(color='#AAAAAA', alpha=0.5)
# Change the color of the outermost gridline (the spine).
ax.spines['polar'].set_color('#888888')
# Change the background color inside the circle itself.
ax.set_facecolor('#FAFAFA')
ax.plot(angles+54/180*np.pi, stats, 'o-', linewidth=2, c='orange')
ax.fill(angles+54/180*np.pi, stats, alpha=0.35, c='orange')
ax.set_thetagrids(angles * 180/np.pi+54, labels, y=-0.1)
ax.grid(True)
ax.set_title("", color='black', y=1.15, weight=600, size=15)
# ax.set_title("Depression factors", color='black', y=1.15, weight=600, size=15)
ax.set_title(u"당신을 우울 원인은?", color='black', y=1.15, weight=600, size=15)
plt.savefig("/home/ec2-user/HOWRU/public/images/chart_dailyDetail/dailyDetail_"+vals+".png", bbox_inches='tight', pad_inches=0.3)

# ##################################################
#
# client = pymongo.MongoClient(
#     "mongodb+srv://happy:pEMnb4TALrXfBqli@cluster0.53v0t.mongodb.net/howru?retryWrites=true")
# db = client.howru
# data = db.users.find_one({"id": id})

# print(f'image/screening_{id}.png')
