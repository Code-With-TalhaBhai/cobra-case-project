# Scraping all assets into public folder
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import os

driver = webdriver.Chrome()
url = "https://github.com/joschan21/casecobra/tree/master/public"
driver.get(url)
time.sleep(3)
content = driver.page_source.encode('utf-8').strip()
soup = BeautifulSoup(content,'html.parser')


anchor_tags = soup.find_all('a')
links = []

for anchor in anchor_tags: 
    href = anchor.get('href')

    if href and (".png" in href or ".jpg" in href):
        title = anchor.get_text(strip=True)
        links.append((title,href))

# try:
#     os.mkdir('./public')
# except:
#     print("Directory already existed")


for link in links:
    title,href = link
    img = requests.get(f"https://github.com/{href}")

    with open(f"./public/{title}",'wb') as file:
        file.write(img.content)


parent_div = soup.findAll('div',class_="react-directory-truncate")

# print(parent_div)

directories = []

for item in parent_div:
    anchor = item.find('a')
    label = anchor.get('aria-label')
    # print(label)
    if "(Directory)" in label:
        href = anchor.get('href')
        title,ext = label.split(",")
        directories.append((title,href))

directories = set(directories)
# print(directories)

for directory in directories:
    title,href = directory

    try:
        os.mkdir(f'./public/{title}')
    except:
        print("Directory already exists")


    dir_url = f"{url}/{title}"
    driver.get(dir_url)
    time.sleep(3)
    content = driver.page_source.encode('utf-8').strip()
    soup = BeautifulSoup(content,'html.parser')

    anchor_tags = soup.find_all('a')
    links = []

    for anchor in anchor_tags:
        href = anchor.get('href')

        if href and (".png" in href or ".jpg" in href):
            link_title = anchor.get_text(strip=True)
            links.append((link_title,href))

    link_set = set(links)

    for link in link_set:
        link_title,href = link
        img = requests.get(f'https://github.com/{href}')

        with open(f"./public/{title}/{link_title}",'wb') as file:
            file.write(img.content)

