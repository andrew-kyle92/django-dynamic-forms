def get_bool_value(value):
    if isinstance(value, bool):
        return value
    elif isinstance(value, int):
        if value == 0:
            return False
        elif value == 1:
            return True
    elif isinstance(value, str):
        if value.lower() == 'true':
            return True
        elif value.lower() == 'false':
            return False
