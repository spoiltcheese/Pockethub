from marshmallow import Schema, fields, validate, EXCLUDE

class AddOneToolsSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=1, max =50, error='name must be between 1 and 50'), required=True),
    description = fields.Str(validate=validate.Length(min=1, max=150, error="description must be between 1 and 150"), required=True),
