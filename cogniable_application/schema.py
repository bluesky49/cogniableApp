import school.schema
import target_allocate.schema
import graphene

from graphene_django.debug import DjangoDebug


class Query(
    school.schema.Query,
    school.schema.Mutation,
    target_allocate.schema.Query,
    target_allocate.schema.Mutation,
    graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name="_debug")

class Mutation(
	school.schema.Mutation,
	target_allocate.schema.Mutation,
	graphene.ObjectType
):
    debug = graphene.Field(DjangoDebug, name="_debug")


schema = graphene.Schema(query=Query, mutation=Mutation)