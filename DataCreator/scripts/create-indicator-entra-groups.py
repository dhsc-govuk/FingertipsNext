import csv
import subprocess

# Input CSV file containing IndicatorID and IndicatorName columns
INPUT_FILE = "indicators.csv"

# Output CSV file that will store the mapping of IndicatorId to created group (RoleId)
OUTPUT_FILE = "indicatorroles.csv"

def create_group(indicator_id, indicator_name, mail_nickname):
    display_name = f"Indicator {indicator_id} Administrators"
    description = f"Administrators of \'{indicator_name}\' (Indicator {indicator_id})"

    try:
        result = subprocess.run(
            [
                "az", "ad", "group", "create",
                "--display-name", display_name,
                "--description", description,
                "--mail-nickname", mail_nickname,
                "--query", "id",
                "-o", "tsv"
            ],
            capture_output=True,
            text=True,
            check=True,
            shell=True
        )
        group_id = result.stdout.strip()
        return group_id

    except subprocess.CalledProcessError as e:
        print(f"Failed to create group for {indicator_name} ({indicator_id})")
        print(e.stderr)
        return None


''' 
This script creates Microsoft Entra ID groups (roles) for each indicator defined in an input CSV file.
Each group represents the administrators for a given indicator.

The environment must have the Azure CLI (https://learn.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) installed and logged into subscription hosting the entra instance to configure roles against.

Input:
    This script reads the the indicators.csv from the data output folder. This must be available within the same directory for the script to run.

Output:
    A CSV file (indicatorroles.csv) mapping each IndicatorId to the created Entra group ID (RoleId),
    which can be used for inserting into the indicatorrole table in the Fingertips database.
'''
def main():
    mappings = []

    with open(INPUT_FILE, newline='', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            indicator_id = row["IndicatorID"]
            indicator_name = row["IndicatorName"]

            # The mail nickname is equivalent to the internal id of the group. It should remain consistent between executions
            # to allow existing indicators to be updated in place.
            mail_nickname = f"ft-indicator-{indicator_id}-administration"

            print(f"Creating group for: {indicator_name} ({indicator_id}) with mail-nickname: {mail_nickname}")

            group_id = create_group(indicator_id, indicator_name, mail_nickname)

            if group_id:
                mappings.append({
                    "IndicatorId": indicator_id,
                    "RoleId": group_id
                })

    if len(mappings) > 0: 
        with open(OUTPUT_FILE, mode="w", newline='', encoding='utf-8') as csvfile:
            fieldnames = ["IndicatorId", "RoleId"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for entry in mappings:
                writer.writerow(entry)

    print(f"\nOutput saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
