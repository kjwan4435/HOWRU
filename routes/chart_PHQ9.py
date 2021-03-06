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

# vals = "3_2_1_3_1_0_0"
vals = sys.argv[1]
tmp = vals.split("_")
PHQ_stats = [float(i) for i in tmp] # list(map(float, tmp))

plt.rcParams["font.family"] = 'NanumGothic'
plt.rcParams['font.size'] = 11.

PHQ_label = ["기분 장애", "불안 장애", "불면증", "낮은 자아존중감", "섭식 장애", "자살 생각", "외상 후 스트레스"]
# PHQ_label = ["Mood disorder", "Anxiety disorder", "Insomnia", "Low self-esteem", "Eating disorder", "Suicide thoughts", "PTSD"]

PHQ_label.reverse()
PHQ_stats.reverse()

fig = plt.figure(figsize=(8.3, 4))
ax = plt.gca()
plt.barh(PHQ_label, PHQ_stats, color="darkblue", alpha=0.4)
ax.set_facecolor('#FAFAFA')
# ax.set_title("Depressive factors?", color='black', y=1.05, weight=600, size=15)
ax.set_title(u"당신의 우울요인 분석 결과 의심되는 심리문제는?", color='black', y=1.05, weight=600, size=15)
plt.yticks(PHQ_label, fontsize=12)
plt.xticks(fontsize=13, weight=600)

x_formatter = FixedFormatter([u"안전", u"심각"])
# x_formatter = FixedFormatter(["Safe", "Severe"])
x_locator = FixedLocator([0.1, 3.05])
ax.tick_params(bottom=True, top=False, left=True, right=False)
ax.xaxis.set_major_formatter(x_formatter)
ax.xaxis.set_major_locator(x_locator)

plt.savefig("/home/ec2-user/HOWRU/public/images/chart_phq9/phq9_"+vals+".png", bbox_inches='tight', pad_inches=0.3)

# client = pymongo.MongoClient(
#     "mongodb+srv://happy:pEMnb4TALrXfBqli@cluster0.53v0t.mongodb.net/howru?retryWrites=true")
# db = client.howru
# data = db.users.find_one({"id": id})

# print(f'image/PHQ_{id}.png')
