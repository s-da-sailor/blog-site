const { mockRequest, mockResponse } = require('mock-req-res');
const contentNegotiation = require('../../../utils/contentNegotiation');

const mockDataJsonInput = {
  id: 1,
  title: 'Dummy Title 1',
  description: 'Dummy Description 1',
  author: 'dummyAuthor1',
  createdAt: '2022-05-10T06:52:27.000Z',
  updatedAt: '2022-05-10T06:52:27.000Z',
};

const mockDataJsonOutput = {
  status: 'success',
  data: {
    id: 1,
    title: 'Dummy Title 1',
    description: 'Dummy Description 1',
    author: 'dummyAuthor1',
    createdAt: '2022-05-10T06:52:27.000Z',
    updatedAt: '2022-05-10T06:52:27.000Z',
  },
};

const mockDataJsonArrayInput = [
  {
    id: 1,
    title: 'Dummy Title 1',
    description: 'Dummy Description 1',
    author: 'dummyAuthor1',
    createdAt: '2022-05-10T06:52:27.000Z',
    updatedAt: '2022-05-10T06:52:27.000Z',
  },
  {
    id: 2,
    title: 'Dummy Title 2',
    description: 'Dummy Description 2',
    author: 'dummyAuthor2',
    createdAt: '2022-05-10T06:52:27.000Z',
    updatedAt: '2022-05-10T06:52:27.000Z',
  },
];

const mockDataJsonArrayOutput = {
  status: 'success',
  results: 2,
  data: [
    {
      id: 1,
      title: 'Dummy Title 1',
      description: 'Dummy Description 1',
      author: 'dummyAuthor1',
      createdAt: '2022-05-10T06:52:27.000Z',
      updatedAt: '2022-05-10T06:52:27.000Z',
    },
    {
      id: 2,
      title: 'Dummy Title 2',
      description: 'Dummy Description 2',
      author: 'dummyAuthor2',
      createdAt: '2022-05-10T06:52:27.000Z',
      updatedAt: '2022-05-10T06:52:27.000Z',
    },
  ],
};

const mockDataXmlOutput = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <status>success</status>
  <data>
    <id>1</id>
    <title>Dummy Title 1</title>
    <description>Dummy Description 1</description>
    <author>dummyAuthor1</author>
    <createdAt>2022-05-10T06:52:27.000Z</createdAt>
    <updatedAt>2022-05-10T06:52:27.000Z</updatedAt>
  </data>
</root>`;

const mockDataTextPlainOutput = `status              : success
data                :
id                  : 1
title               : Dummy Title 1
description         : Dummy Description 1
author              : dummyAuthor1
createdAt           : 2022-05-10T06:52:27.000Z
updatedAt           : 2022-05-10T06:52:27.000Z
`;

const mockDataHtmlOutput = `{
  <span class="string key">"status"</span>: <span class="string value">"success"</span>,
  <span class="string key">"data"</span>: {
    <span class="string key">"id"</span>: <span class="number">1</span>,
    <span class="string key">"title"</span>: <span class="string value">"Dummy Title 1"</span>,
    <span class="string key">"description"</span>: <span class="string value">"Dummy Description 1"</span>,
    <span class="string key">"author"</span>: <span class="string value">"dummyAuthor1"</span>,
    <span class="string key">"createdAt"</span>: <span class="string value">"2022-05-10T06:52:27.000Z"</span>,
    <span class="string key">"updatedAt"</span>: <span class="string value">"2022-05-10T06:52:27.000Z"</span>
  }
}`;

describe('Test contentNegotiation serveData', () => {
  test('serve data in json', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'application/json',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('application/json');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataJsonOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('serve data in xml', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'application/xml',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('application/xml');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataXmlOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('serve data in plain text', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'text/plain',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('text/plain');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataTextPlainOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('serve data in plain html', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'text/html',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('text/html');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataHtmlOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('serve data in plain text', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'text/plain',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('text/plain');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataTextPlainOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });

  test('serve array data in json', async () => {
    jest.clearAllMocks();

    const mockReq = mockRequest({
      headers: {
        accept: 'application/json',
      },
    });
    const mockRes = mockResponse();
    const mockNext = jest.fn();

    jest.spyOn(mockRes, 'setHeader').mockImplementation((arg1, arg2) => {
      expect(arg1).toBe('Content-Type');
      expect(arg2).toBe('application/json');
    });

    jest.spyOn(mockRes, 'status').mockImplementation((statusCode) => {
      expect(statusCode).toBe(200);
      return mockRes;
    });

    jest.spyOn(mockRes, 'send').mockImplementation((data) => {
      expect(data).toEqual(mockDataJsonArrayOutput);
    });

    contentNegotiation.serveData(
      mockDataJsonArrayInput,
      200,
      mockReq,
      mockRes,
      mockNext
    );

    expect(mockRes.setHeader).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.send).toHaveBeenCalledTimes(1);
  });
});
