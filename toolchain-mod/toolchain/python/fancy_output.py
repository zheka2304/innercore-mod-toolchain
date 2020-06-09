def print_err(message):
    #        bold         red                 default
    print('\033[1m' + '\033[31m' + message + '\033[0m')


def print_info(message):
    #       yellow                default
    print('\033[33m' + message + '\033[0m')


def print_ok(message):
    #        bold        green                default
    print('\033[1m' + '\033[92m' + message + '\033[0m')


def print_warn(message):
    #        bold        cyan                 default
    print('\033[1m' + '\033[35m' + message + '\033[0m')
