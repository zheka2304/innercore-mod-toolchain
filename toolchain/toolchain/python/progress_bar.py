def print_progress_bar(iteration, total, prefix = "", suffix = "", decimals = 1, length = 100, fill = "\u2588"):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + "-" * (length - filledLength)
    print(f"\r{prefix} |{bar}| {percent}% {suffix}", end = "\r")
    if iteration == total: 
        print()
