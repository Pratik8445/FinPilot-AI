from pydantic import BaseModel


class CompanyCreate(BaseModel):
    name: str
    ticker: str
    sector: str


class CompanyUpdate(BaseModel):
    name: str
    ticker: str
    sector: str


class CompanyResponse(BaseModel):
    id: int
    name: str
    ticker: str
    sector: str

    model_config = {
        "from_attributes": True
    }