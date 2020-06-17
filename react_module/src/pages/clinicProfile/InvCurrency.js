/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Typography, Button, Tag, Select, notification } from 'antd'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'

const { Text } = Typography
const { Option } = Select

const SCHOOL_CURRENCY = gql`
  query {
    schoolDetail {
      currency {
        id
        currency
        symbol
      }
    }
  }
`

const CURRENCY = gql`
  query {
    currency {
      id
      currency
      symbol
    }
  }
`

const ADD_CURRENCY = gql`
  mutation addCurrency($id: ID!) {
    addCurrency(input: { currencyId: $id }) {
      currency {
        id
        currency
        symbol
      }
    }
  }
`

export default () => {
  const [newCurrency, setNewCurrency] = useState()

  const { data, error, loading, refetch } = useQuery(SCHOOL_CURRENCY, {
    fetchPolicy: 'no-cache',
  })
  const { data: currencyData, error: currencyError, loading: currencyLoading } = useQuery(CURRENCY)

  const [
    addCurrency,
    { data: addCurrencyData, error: addCurrencyError, loading: addCurrencyLoading },
  ] = useMutation(ADD_CURRENCY)

  useEffect(() => {
    if (data) {
      setNewCurrency(data.schoolDetail.currency.id)
    }
  }, [data])

  useEffect(() => {
    if (currencyError) {
      notification.error({
        message: 'Faild to load avalable currency list',
      })
    }
  }, [currencyError])

  useEffect(() => {
    if (addCurrencyData) {
      notification.success({
        message: 'School currency update sucessfully',
      })
      refetch()
    }
    if (addCurrencyError) {
      notification.error({
        message: 'School currency update failed',
      })
    }
  }, [addCurrencyData, addCurrencyError])

  const handleSubmit = () => {
    addCurrency({
      variables: {
        id: newCurrency,
      },
    })
  }

  return (
    <div style={{ marginTop: 35 }}>
      <Text style={{ fontSize: 20, fontWeight: 600 }}>Change Currency</Text>

      <div style={{ marginTop: 15 }}>
        <Select
          loading={currencyLoading}
          defaultActiveFirstOption
          value={newCurrency}
          onChange={v => setNewCurrency(v)}
          style={{ width: '85%' }}
          size="large"
          placeholder="Select a currency"
        >
          {currencyData?.currency.map(({ id, currency, symbol }) => {
            return (
              <Option key={id} value={id}>
                {symbol} {currency}
              </Option>
            )
          })}
        </Select>
        <Button
          type="primary"
          style={{
            background: '#0B35B3',
            borderRadius: 4,
            marginLeft: 18,
            width: 110,
          }}
          onClick={handleSubmit}
          loading={addCurrencyLoading}
          size="large"
        >
          Save
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        {loading ? (
          'Loading...'
        ) : (
          <div>
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            {data && (
              <div style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>Active Currency: </Text>
                <Tag
                  style={{
                    height: 56,
                    width: 137,
                    background: '#F9F9F9',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    position: 'relative',
                    marginTop: 7,
                  }}
                >
                  {data.schoolDetail.currency.symbol} {data.schoolDetail.currency.currency}
                </Tag>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
