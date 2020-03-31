def multidb_context_processor(request):
    """
    This context processor will add a db_name to the request.

    Add this to your Django context processors, for example:

    TEMPLATE_CONTEXT_PROCESSORS +=[
        'bananaproject.multidb.multidb_context_processor']
    """
    if hasattr(request, 'SELECTED_DATABASE'):
        return {'db_name': request.SELECTED_DATABASE}
    else:
        return {}