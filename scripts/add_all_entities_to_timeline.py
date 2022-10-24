from alephclient.api import AlephAPI
from getpass import getpass

key = getpass('Aleph API key:')
api = AlephAPI('http://localhost:8080', api_key=key)
c_id = '1'
tl_id = '92bcd3d511324c94a94a070e81162a95'

c = api.get_collection(collection_id=c_id)
entities = list(api.stream_entities(collection=c))

res = api.write_entities(
  c_id,
  entities,
  entityset_id=tl_id,
)

print(res)