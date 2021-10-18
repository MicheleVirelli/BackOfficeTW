import sys, pyperclip

import pip 
import os

def install(package):
    if hasattr(pip, 'main'):
        pip.main(['install', package])
    else:
        pip._internal.main(['install', package])


install("pyperclip")

os.system('cls' if os.name == 'nt' else 'clear')

singlespace = " "
space = "  "
def crnspace(n):
    string = "\n"
    for i in range(n):
        string += space
    return string

def waitAnswer(inputString, possibleAnswer):
    answ = ""
    while answ not in possibleAnswer:
        answ = input(inputString)

    return answ

if __name__ == '__main__':    

    finalString = ""
    path = input("Write the path of the api \t")
    method = input("Method type (GET, PUT, POST, DELETE, PATCH) \t").lower()
    tags = input("tags of the api \t")
    summary = input("Summary of the api \t")
    operationId = input("Operation ID: \t")

    finalString = f"""{space}{path}:{crnspace(2)}{method}:{crnspace(3)}tags:{crnspace(3)}- {tags}{crnspace(3)}summary: {summary}{crnspace(3)}operationId: {operationId}"""

    needParams = ""
    while needParams != "YES" and needParams != "NO":
            needParams = input("Need parameters? [YES, NO]: \t").upper()

    parameters = []
    while needParams == "YES":
        parameterName = input("Parameter name: \t")
        parameterIn = input("Parameter in [PATH, QUERY, HEADER]: \t").lower()
        parameterDescription = input("parameter description: \t")
        
        parameterSchema = ""
        while parameterSchema != "TYPE" and parameterSchema != "PATH":
            parameterSchema = input("parameter schema: [TYPE, REF] \t").upper()

        parameterType = ""
        if parameterSchema == "TYPE":
            parameterType  = "type"
            parameterValue = input("Parameter type: \t").lower()
        else:
            parameterType = "$ref"
            parameterValue = input("Parameter ref: \t").lower()
        parameterRequired = input("Parameter required? [true, false] \t").lower()
        parameterExamples = input("Parameter examples: \t")

        param = {
            "parameterName": parameterName,
            "parameterIn": parameterIn,
            "parameterDescription": parameterDescription,
            "parameterType": parameterType,
            "parameterValue": parameterValue,
            "parameterRequired": parameterRequired,
            "parameterExamples": parameterExamples
        }

        parameters.append(param)
        needParams = input("Need other parameters? [YES, NO] \t").upper()

    if len(parameters) > 0 :
        finalString += f"""{crnspace(3)}parameters:"""

    for parameter in parameters:
        finalString += f"""{crnspace(4)}-{singlespace}name: {parameter["parameterName"]}"""
        finalString += f"""{crnspace(5)}in: {parameter["parameterIn"]}"""
        finalString += f"""{crnspace(5)}description: {parameter["parameterDescription"]}"""
        finalString += f"""{crnspace(5)}example: {parameter["parameterExamples"]}"""
        finalString += f"""{crnspace(5)}required: {parameter["parameterRequired"]}"""
        finalString += f"""{crnspace(5)}schema:{crnspace(6)}{parameter["parameterType"]}: {parameter["parameterValue"]}"""

    needResponses = waitAnswer("parameter responses: [YES, NO] \t", ["YES", "NO"])
    responses = []
    while needResponses == "YES":
        response = {}
        responseNumber = input("Response number: \t")
        responseDescription = input("Response description: \t")

        responseReturnNeeded = waitAnswer("Need return value? [YES, NO] \t", ["YES", "NO"])
        responseReturn = ""
        if responseReturnNeeded == "YES":
            responseReturnNeeded = waitAnswer("Need array? [YES, NO] \t", ["YES", "NO"])
            if responseReturnNeeded == "YES":
                responseReturnNeeded = waitAnswer("Value are ref? [YES, NO] \t", ["YES", "NO"])
                if responseReturnNeeded == "YES":
                    responseReturnRefName = input("Ref name: \t")
                    responseReturn = f"""type: array{crnspace(8)}items:{crnspace(9)}$ref: '#/components/schemas/{responseReturnRefName}'"""
                else:
                    responseReturnTypeName = input("Type name: \t")
                    responseReturn = f"""type: array{crnspace(8)}items:{crnspace(9)}type: {responseReturnTypeName}"""
            else:
                responseReturnNeeded = input("Value is ref? [YES, NO] \t").upper()
                if responseReturnNeeded == "YES":
                    responseReturnRefName = input("Ref name: \t")
                    responseReturn = f"""$ref:'#/components/schemas/{responseReturnRefName}'"""
                else:
                    responseReturnTypeName = input("Type name: \t")
                    responseReturn = f"""type: {responseReturnTypeName}"""           

        response = {
            "responseNumber": responseNumber,
            "responseDescription": responseDescription,
            "responseReturn": responseReturn,
        }

        responses.append(response)
        needResponses = waitAnswer("Need other responses? [YES, NO] \t", ["YES", "NO"])

    if len(responses) > 0 :
        finalString += f"""{crnspace(3)}responses:"""

    for response in responses:
        finalString += f"""{crnspace(4)}'{response["responseNumber"]}':"""
        finalString += f"""{crnspace(5)}description: {response["responseDescription"]}"""
        
        if response["responseReturn"] is not "":
            finalString += f"""{crnspace(5)}content:{crnspace(6)}application/json:{crnspace(7)}schema:{crnspace(8)}{response["responseReturn"]}"""

    print(finalString)

    dir_path = os.path.dirname(os.path.realpath(__file__))
    with open(f"""{dir_path}/apiCreatorResult.txt""", 'w') as f:
        f.write(finalString)
        f.write("\n\n\n\n\n_____________________________________OLD_PASTE___________________________ \n\n")
        f.write(pyperclip.paste())

    pyperclip.copy(finalString)
