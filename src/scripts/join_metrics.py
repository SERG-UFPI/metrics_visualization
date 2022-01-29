import os
from os.path import isfile, join
import json

SOURCE_FILEPATH = '../data/data.json'
METRICS_FILEPATH = 'metrics file'

with open(SOURCE_FILEPATH, 'r') as f:
        source = json.load(f)

def startupCheck(path):
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(json.dumps({'metrics': {}}))


def joinMetric(source, new_metric, new_metric_name):
    source['metrics'][new_metric_name] = []

    for repo in new_metric:
        source['metrics'][new_metric_name].append(
            {'name': repo, 'value': new_metric[repo]})

    with open(SOURCE_FILEPATH, 'w') as f:
        json.dump(source, f)

        print('Metric {} joined'.format(new_metric_name))


startupCheck(SOURCE_FILEPATH)


def getAllFilesNamesInAFolder(folder_path):
    return [f for f in os.listdir(folder_path) if isfile(join(folder_path, f))]


def getOption():
    while(True):
        print('\n---------- OPTIONS ----------\n')
        print('1 - Insert only one file')
        print('2 - Insert all files from a folrder')
        option = int(input('\n\nInsert a option: '))

        if (option >= 1 and option <= 2):
            return option


def insertOneFile():
    with open(SOURCE_FILEPATH, 'r') as f:
        source = json.load(f)

    new_metric_filename = input('Type the file name of the new metric: ')

    with open('{}.json'.format(new_metric_filename), 'r') as f:
        new_metric = json.load(f)

    new_metric_name = new_metric_filename.split('/')[-1]

    joinMetric(source, new_metric, new_metric_name)


def insertAllFilesFromAFolder(source, folder_path):
    for file in getAllFilesNamesInAFolder(folder_path):
        if (file.endswith('.json')):
            with open('{}/{}'.format(folder_path, file), 'r') as f:
                new_metric = json.load(f)
            
            joinMetric(source, new_metric, file[:-5])


if __name__ == "__main__":

    option = getOption()

    if (option == 1):
        insertOneFile()
    elif(option == 2):
        insertAllFilesFromAFolder(source, METRICS_FILEPATH)
