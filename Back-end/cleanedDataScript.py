import pandas as pd
import sys
import json

def clean_data(csv_file_path):
    try:
        df = pd.read_csv(csv_file_path)

        columns_to_drop = ['assessment type', 'submission date', 'attempt', 'assessment question', 'assessment question id', 'assignment url']
        df.drop(columns=columns_to_drop, inplace=True)

        df[['course sis', 'section', 'year', 'crn']] = df['course sis id'].str.split('-', expand=True)
        df.drop(columns=['course sis id'], inplace=True)
        df['year'] = df['year'].str[:-2]
        df['intake'] = df['year'].str[:-2]

        df.rename(columns={'account name': 'school name', 'account id': 'school id'}, inplace=True)

        columns_to_drop = ['course sis', 'section', 'section sis id', 'submission score', 'learning outcome rating points', 'learning outcome mastery score', 'learning outcome mastered', 'learning outcome friendly name']
        df.drop(columns=columns_to_drop, inplace=True)

        df = df.reindex(columns=['crn', 'school id', 'school name', 'course id', 'course name', 'section id', 'section name', 'assessment id', 'assessment title', 'learning outcome id', 'learning outcome name', 'learning outcome points possible', 'outcome score', 'learning outcome rating', 'year', 'intake', 'enrollment state'])

        mapping = {'10': 'Fall', '20': 'Spring', '30': 'Summer'}
        df['intake'] = df['intake'].replace(mapping)

        json_data = df.to_json(orient='records')

        print(json_data)
    except Exception as e:
        sys.stderr.write("Error cleaning data: {}\n".format(str(e)))

if __name__ == "__main__":
    csv_file_path = sys.argv[1]

    clean_data(csv_file_path)


