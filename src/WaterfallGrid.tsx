import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: hidden;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GridItem = styled.div`
  background: ${(props) => props.color};
  border-radius: 10px;
  width: 100%;
  height: ${(props) => props.height}px;
  display: flex;
  justify-content: center;
  align-items: center;  // 修复拼写错误
  color: white;
  font-size: 24px;
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 20px;
  color: #555;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  &:hover {
    background-color: #2980b9;
  }
`;

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateRandomImages = (count, startId) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    const height = Math.floor(Math.random() * 300) + 100;
    const color = generateRandomColor();
    images.push({ id: startId + i, height, color });
  }
  return images;
};

const distributeItemsToColumns = (items, columnCount) => {
  const columns = Array.from({ length: columnCount }, () => ({
    items: [],
    totalHeight: 0,
  }));

  items.forEach((item) => {
    let minHeightColumnIndex = 0;
    let minHeight = columns[0].totalHeight;

    for (let i = 1; i < columnCount; i++) {
      if (columns[i].totalHeight < minHeight) {
        minHeightColumnIndex = i;
        minHeight = columns[i].totalHeight;
      }
    }

    columns[minHeightColumnIndex].items.push(item);
    columns[minHeightColumnIndex].totalHeight += item.height;
  });

  return columns.map((column) => column.items);
};

const WaterfallGrid = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  const [columnCount, setColumnCount] = useState(1);

  const loadMoreImages = () => {
    setLoading(true);
    setTimeout(() => {
      const newImages = generateRandomImages(20, images.length + 1);
      setImages((prevImages) => {
        const allImages = [...prevImages, ...newImages];
        if (allImages.length >= 50) {
          setHasMore(false);
        }
        return allImages;
      });
      setLoading(false);
    }, 1000);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasMore &&
        !loading
      ) {
        loadMoreImages();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [hasMore, loading]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setColumnCount(2);
    } else if (width < 1024) {
      setColumnCount(4);
    } else if (width < 1440) {
      setColumnCount(5);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRefreshClick = () => {
    loadMoreImages();
  };

  const columns = distributeItemsToColumns(images, columnCount);

  return (
    <div ref={containerRef} style={{ height: '100vh', overflowY: 'auto' }}>
      <Container>
        {columns.map((column, columnIndex) => (
          <Column key={columnIndex}>
            {column.map((image) => (
              <GridItem
                key={image.id}
                height={image.height}
                color={image.color}
              >
                {image.id}
              </GridItem>
            ))}
          </Column>
        ))}
      </Container>
      {!images.length && !loading && (
        <MessageBox>
          <div>
            <p>没有数据</p>
            <Button onClick={handleRefreshClick}>点击刷新加载更多数据</Button>
          </div>
        </MessageBox>
      )}
      {loading && <MessageBox>加载数据中...</MessageBox>}
      {!hasMore && !loading && images.length >= 50 && (
        <MessageBox>没有更多数据了</MessageBox>
      )}
    </div>
  );
};

export default WaterfallGrid;
